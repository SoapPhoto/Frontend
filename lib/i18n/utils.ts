import { Request } from 'express';
import cookie from 'js-cookie';
import format from 'string-format';
import _ from 'lodash';

import { LocaleType, LocaleTypeValues } from '@common/enum/locale';
import { request } from '@lib/common/utils/request';
import { server } from '@lib/common/utils';
import { II18nValue } from './I18nProvider';
import { TFunction } from './interface';

let globalValue: RecordPartial<string, any> = {};

let currentLocale: LocaleType;

// 获取i18n数据
export const fetchI18n = async (locale: LocaleType) => {
  try {
    const url = server ? `http://127.0.0.1:${process.env.PAGE_PORT}` : process.env.URL;
    const { data } = await request.get(`${url}/static/locales/${locale}.json?v=0.1.9.1`);
    return data;
  } catch (err) {
    console.error('fetchI18n Error');
    return {};
  }
};

// 服务器初始化
export const initLocale = async (req?: Request): Promise<II18nValue> => {
  if (server && req) {
    currentLocale = LocaleType['zh-CN'];
    // server 需要重置一下
    globalValue = {};
    currentLocale = req.locale;
    if (LocaleTypeValues.includes(req.cookies.locale)) {
      currentLocale = req.cookies.locale;
    }
  } else if (cookie.get('locale') && LocaleTypeValues.includes(cookie.get('locale') as LocaleType)) {
    currentLocale = cookie.get('locale') as LocaleType;
  }
  let data = globalValue;
  if (server) {
    data = await fetchI18n(currentLocale);
  }
  const value = {
    ...data,
  };
  globalValue = value;
  return {
    locale: currentLocale,
    value,
  };
};

// 服务器端数据同步客户端
export const initI18n = (value: II18nValue) => {
  currentLocale = value.locale;
  globalValue = value.value;
  return value;
};

export const getT = (
  data: Pick<II18nValue, 'value'>,
  value: string,
  ...arg: Array<({ [k: string]: any } | string)>
) => {
  let title = value;
  const v = _.get(data.value, `${value}`);
  if (v && typeof v === 'string') {
    title = format(v, ...arg);
  }
  return title;
};

export const t: TFunction = (...arg) => getT(
  { value: globalValue },
  ...arg,
);
