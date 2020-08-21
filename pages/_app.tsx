import App from 'next/app';
import React from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import withApollo, { WithApolloProps } from 'next-with-apollo';
import { getDataFromTree } from '@apollo/react-ssr';

import 'mobx-react-lite/batchingForReactDom';

import 'dayjs/locale/es';
import 'dayjs/locale/zh-cn';

import ErrorPage from '@pages/_error';
import { Router as RouterProvider } from '@lib/router';
import { HttpStatus } from '@lib/common/enums/http';
import { ICustomNextAppContext } from '@lib/common/interfaces/global';
import { createClient } from '@lib/common/apollo';
import { BodyLayout } from '@lib/containers/BodyLayout';
import { ThemeWrapper } from '@lib/containers/Theme';
import { Router } from '@lib/routes';
import {
  IInitialStore, store,
} from '@lib/stores/init';
import { DefaultSeo } from 'next-seo';
import { withMobx } from '@lib/stores/withMobx';
import { withAppTranslation } from '@lib/i18n/withAppTranslation';
import { observer } from 'mobx-react';
import Head from 'next/head';
import { getPictureUrl } from '@lib/common/utils/image';
import { ApolloProvider } from 'react-apollo';

interface IProps extends WithApolloProps<any> {
  pageProps: IPageProps;
}

interface IPageError {
  error?: string;
  statusCode: number;
  message?: string;
}

interface IPageProps {
  initialStore: IInitialStore;
  error?: IPageError;
  statusCode?: number;
}

let timer: number;

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

Router.events.on('routeChangeStart', () => {
  timer = window.setTimeout(() => {
    store.appStore.setLoading(true);
  }, 200);
});
Router.events.on('routeChangeComplete', () => {
  clearTimeout(timer!);
  store.appStore.setLoading(false);
});
Router.events.on('routeChangeError', () => {
  clearTimeout(timer!);
  store.appStore.setLoading(false);
});

@observer
class MyApp extends App<IProps> {
  // 初始化页面数据
  public static async getInitialProps(data: any) {
    const { ctx, Component } = data as ICustomNextAppContext;
    const { res } = ctx;
    let statusCode = HttpStatus.OK;
    if (ctx.query.error) {
      statusCode = ctx.query.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (res && res.statusCode >= 400) {
      statusCode = res.statusCode;
    } else if (ctx.pathname === '/_error') {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    let pageProps: any = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    if (res && statusCode !== HttpStatus.OK) {
      res.status(statusCode);
    }
    return {
      pageProps: {
        ...pageProps,
        statusCode,
      },
    };
  }

  public render() {
    const {
      Component, pageProps, apollo,
    } = this.props;
    const isError = (pageProps.error && pageProps.error.statusCode >= 400) || pageProps.statusCode >= 400;
    const noHeader = pageProps && pageProps.header === false;
    const { error, ico } = pageProps;
    return (
      <RouterProvider>
        <ApolloProvider client={apollo}>
          <Head>
            {
              ico ? (
                <link rel="shortcut icon" type="image/jpg" href={getPictureUrl(ico, 'ico', false)} />
              ) : (

                <link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
              )
            }
          </Head>
          <ThemeWrapper>
            <BodyLayout header={!isError && !noHeader}>
              <DefaultSeo
                description="photo, life, happy"
              />
              {
                isError ? (
                  <ErrorPage error={error} statusCode={error ? error.statusCode : pageProps.statusCode} />
                ) : (
                  <Component
                    {...pageProps}
                  />
                )
              }
            </BodyLayout>
          </ThemeWrapper>
        </ApolloProvider>
      </RouterProvider>
    );
  }
}

export default withApollo(createClient, { getDataFromTree })(withAppTranslation(withMobx(
  MyApp,
)));
