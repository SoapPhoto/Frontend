import { css } from 'styled-components';
import { theme } from '@lib/common/utils/themes';

export const scrollbar = css`
#theme-demo-plugin-four-graidient-left, #theme-demo-plugin-four-graidient-right {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  -webkit-transition: opacity .3s;
  transition: opacity .3s;
  width: 30px;
  height: 100%;
  pointer-events: none;
}
#theme-demo-plugin-four-graidient-left {
  left: 0;
  background: linear-gradient(to right,${theme('styles.scrollbar.graidient')} 0,transparent 100%);
}
#theme-demo-plugin-four-graidient-right {
  right: 0;
  background: linear-gradient(to right,transparent 0,${theme('styles.scrollbar.graidient')} 100%);
}
.os-theme-dark>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle{background: ${theme('styles.scrollbar.background')}}
/* .os-theme-light>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle{background:rgba(255,255,255,.4)} */
.os-theme-dark>.os-scrollbar:hover>.os-scrollbar-track>.os-scrollbar-handle{background:${theme('styles.scrollbar.hover')}}
/* .os-theme-light>.os-scrollbar:hover>.os-scrollbar-track>.os-scrollbar-handle{background:rgba(255,255,255,.55)} */
.os-theme-dark>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle.active{background:${theme('styles.scrollbar.active')}}
/* .os-theme-light>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle.active{background:rgba(255,255,255,.7)} */
`;
