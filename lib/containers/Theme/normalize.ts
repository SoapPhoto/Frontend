/* eslint-disable max-len */
import { css } from 'styled-components';

// _: ThemedStyledProps<{}, DefaultTheme>

const normalize = () => css`
  html {
    line-height: 1.15; /* 1 */
    -ms-text-size-adjust: 100%; /* 2 */
    -webkit-text-size-adjust: 100%; /* 2 */
    font-size: 16px;
  }
  body {
    font-size: ${prop => prop.theme.fontSizes[1]}px !important;
    line-height: 1.5;
    overflow-y: scroll;
    overflow-x: hidden;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
  }
  html,body{
    width: 100%;
  }
  ol, ul {
    list-style: none;
  }
  *, *:before, *:after {
     -moz-box-sizing: border-box;
     -webkit-box-sizing: border-box;
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
  article,
  aside,
  footer,
  header,
  nav,
  section {
    display: block;
  }
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  figcaption,
  figure,
  main {
    display: block;
  }
  figure {
    margin: 1em 40px;
  }
  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }
  pre {
    font-size: 1em; /* 2 */
  }
  a {
    background-color: transparent; /* 1 */
    -webkit-text-decoration-skip: objects; /* 2 */
  }
  abbr[title] {
    border-bottom: none; /* 1 */
    text-decoration: underline; /* 2 */
    text-decoration: underline dotted; /* 2 */
  }
  b,
  img {
    border-style: none;
  }
  /* svg:not(:root) {
    overflow: hidden;
  } */
  button,
  input,
  optgroup,
  select,
  textarea {
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  button,
  input {
    overflow: visible;
  }
  button,
  select {
    text-transform: none;
  }
  button,
  html [type="button"],
  [type="reset"],
  [type="submit"] {
     -webkit-appearance: button;
  }
  button::-moz-focus-inner,
  [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner,
  [type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }
  button:-moz-focusring,
  [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring,
  [type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }
  textarea {
    overflow: auto;
  }
  [type="checkbox"],
  [type="radio"] {
    box-sizing: border-box;
    padding: 0;
  }
  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }
  [type="search"] {
     -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  [type="search"]::-webkit-search-cancel-button,
  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
     -webkit-appearance: button; /* 1 */
    font: inherit; /* 2 */
  }
  canvas {
    display: inline-block;
  }
  [hidden] {
    display: none;
  }
  body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section {
    margin: 0;
    padding: 0;
  }
  abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    text-decoration: underline dotted;
  }
`;

export default normalize;
