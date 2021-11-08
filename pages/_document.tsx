import Document, {
  DocumentContext, Head, Main, NextScript, Html,
} from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@lib/common/utils';

const isProd = process.env.NODE_ENV === 'production';

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
      });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [(
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )],
      };
    } finally {
      sheet.seal();
    }
  }

  public render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="renderer" content="webkit" />
          {/* eslint-disable-next-line max-len */}
          <meta name="keywords" content="soap, picture, great photographers, photographers, photography images, photography, photos, sell photos online, sell your photos, share photos, your photos, 图片, 照片" />
          <link rel="manifest" href="/static/manifest.json" />
          {/* <link rel="shortcut icon" type="image/ico" href="/favicon.ico" /> */}
          <link rel="stylesheet" href="//fonts.geekzu.org/css?family=Rubik:400,500,600" />
          {/* <link rel="stylesheet" href="https://cdn-oss.soapphoto.com/fonts/LXGWWenKai.cf3df82d-25cb-48a0-9a35-0b13c8eb4151.css" /> */}
          <link rel="stylesheet" href="https://cdn-oss.soapphoto.com/fonts/OPPOSans.cf3df82d-25cb-48a0-9a35-0b13c8eb4151.css" />
          <script src={`${process.env.OSS_URL}static/script/jquery.min.js`} />
          <script src={`${process.env.OSS_URL}static/script/jquery.fancybox.js`} />
          <link href={`${process.env.OSS_URL}static/style/jquery.fancybox.css`} rel="stylesheet" />
          {/* <script data-ad-client="ca-pub-6853711451561555" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" /> */}
          {
            isProd && (
              <>
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-150810690-1" />
                <script dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'UA-150810690-1');`,
                }}
                />
              </>
            )
          }
        </Head>
        <body id="body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
