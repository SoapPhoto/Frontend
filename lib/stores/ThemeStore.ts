import {
  action, computed, makeObservable, observable,
} from 'mobx';
import cookie from 'js-cookie';

import { server } from '@lib/common/utils';
import { getTheme, ThemeType } from '@lib/common/utils/themes';

export class ThemeStore {
  @observable public theme: ThemeType = 'base';

  constructor() {
    makeObservable(this);
  }

  // 用来初始化
  public update = (store?: Partial<ThemeStore>) => {
    if (store) {
      if (store.theme !== undefined) {
        this.setTheme(store.theme);
      }
    }
  }

  get themeData() {
    console.log(123123);
    return getTheme(this.theme);
  }

  public setTheme = (theme: ThemeType) => {
    if (!server) {
      cookie.set('theme', theme);
    }
    this.theme = theme;
  }
}
