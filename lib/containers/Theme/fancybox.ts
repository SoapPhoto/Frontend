import { rem } from 'polished';
import { css, DefaultTheme, ThemedStyledProps } from 'styled-components';

export const fancybox = (props: ThemedStyledProps<{}, DefaultTheme>) => css`
  .fancybox-bg {
    background: #000;
  }
  .fancybox-toolbar {
    right: ${rem(12)};
    top: ${rem(12)};
  }
  .fancybox-is-open .fancybox-bg {
    opacity: 1 !important;
  }
  .fancybox-button {
    border-radius: 100% !important;
    backdrop-filter: saturate(180%) blur(20px);
  }
  .fancybox-button--zoom {
    margin-right: ${rem(12)};
  }
`;
