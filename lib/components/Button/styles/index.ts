import { rem, lighten, darken } from 'polished';
import styled, { css, ThemedStyledProps, DefaultTheme } from 'styled-components';
import { theme } from '@lib/common/utils/themes';

const loadingCss = ({ loading }: { loading: number }) => (loading
  ? css`
    pointer-events: none;
  ` : '');

interface IBtnIProp {
  loading: number;
  danger: number;
  text?: number;
  size?: string;
  shape?: string;
}
interface IBtnAttr {
  background: string;
  danger: number;
  text: number;
  borderColor: string;
  size: string;
  shape: string;
  height: number;
}

// eslint-disable-next-line arrow-parens
export const buttonStyle = (style: string) => <T>(context: ThemedStyledProps<IBtnIProp, DefaultTheme>): any => {
  const heights: Record<string, string> = {
    small: rem(24),
    large: rem(40),
  };
  const paddings: Record<string, string> = {
    small: `0 ${rem(7)}`,
    large: `${rem(6.4)} ${rem(15)}`,
  };
  const borderColors: Record<string, string> = {
    1: context.theme.colors.danger,
  };
  switch (style) {
    case 'height':
      return context.size ? heights[context.size] : rem(32);
    case 'borderColor':
      return borderColors[context.danger] || 'transparent';
    case 'background':
      return borderColors[context.danger] || context.theme.colors.primary;
    case 'textColor':
      return '#fff';
    case 'padding':
      return context.size ? paddings[context.size] : `${rem(4)} ${rem(15)}`;
    case 'fontsize':
      return context.size === 'small' ? rem(context.theme.fontSizes[0]) : rem(context.theme.fontSizes[1]);
    default:
      return '';
  }
};

export const BaseButtonStyle = css`
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  height: ${rem(32)};
  padding: ${rem(4)} ${rem(15)};
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  outline: 0;
  &:active, &:focus {
    outline: 0;
  }
`;

export const StyleButton = styled.button<IBtnIProp>`
  ${BaseButtonStyle}
  height: ${buttonStyle('height')};
  border-radius: ${rem('2px')};
  border-color: ${buttonStyle('borderColor')};
  background-color: ${buttonStyle('background')};
  color: ${_ => (_.loading ? 'transparent' : buttonStyle('textColor')(_))};
  padding: ${buttonStyle('padding')};
  font-size: ${buttonStyle('fontsize')};
  ${loadingCss}
  &:disabled {
    cursor: not-allowed;
    opacity: .25;
    pointer-events: none;
  }
  &>svg {
    vertical-align: -${rem(2)};
    margin-right: ${rem(12)};
  }
  &:hover {
    border-color: ${_ => lighten(0.05, buttonStyle('borderColor')(_))};
    background-color: ${_ => lighten(0.05, buttonStyle('background')(_))};
  }
  &:active {
    border-color: ${_ => darken(0.05, buttonStyle('borderColor')(_))};
    background-color: ${_ => darken(0.05, buttonStyle('background')(_))};
  }
  /* ${_ => _.size === 'small' && css`
    padding: 0 ${rem(12)};
    font-size: ${test => rem(theme('fontSizes[30]')(test))};
  `}
  ${_ => _.size === 'large' && css`
    padding: 0 ${rem(15)};
  `} */
  /* ${_ => _.shape === 'circle' && css`
    border-radius: 50%;
    width: ${rem(_.height)};
    height: ${rem(_.height)};
    padding: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    &>svg {
      margin-right: 0;
    }
  `}
  ${_ => _.shape === 'round' && css`
    border-radius: 50%;
    border-radius: ${rem(_.height)};
  `} */
`;

export const TextButton = styled(StyleButton)<IBtnIProp>`
  background: transparent;
  border-color: transparent;
  &:hover {
    color: ${_ => lighten(0.05, _.danger ? theme('colors.danger')(_) : theme('colors.primary')(_))};
  }
  &:active {
    color: ${_ => darken(0.05, _.danger ? theme('colors.danger')(_) : theme('colors.primary')(_))};
  }
`;

export const ShapeButton = styled(StyleButton)<IBtnIProp>`
  ${_ => _.shape === 'circle' && css`
    border-radius: 50%;
    width: ${buttonStyle('height')};
    height: ${buttonStyle('height')};
    padding: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    &>svg {
      margin-right: 0;
    }
  `}
  ${_ => _.shape === 'round' && css`
    border-radius: 50%;
    border-radius: ${buttonStyle('height')};
    padding-left: ${rem(16)};
    padding-right: ${rem(16)};
  `}
`;

export const LoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
