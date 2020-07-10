import {
  rem, lighten, darken, rgba,
} from 'polished';
import styled, { css, ThemedStyledProps, DefaultTheme } from 'styled-components';
import { theme } from '@lib/common/utils/themes';

const loadingCss = ({ loading }: { loading: number }) => (loading
  ? css`
    pointer-events: none;
  ` : '');

interface IBtnIProp {
  loading: number;
  danger: number;
  btnType?: 'primary' | 'text';
  size?: string;
  shape?: string;
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
    primary: 'transparent',
    text: 'transparent',
  };
  const backgroundColors: Record<string, string> = {
    primary: context.theme.colors.primary,
    text: 'transparent',
  };
  switch (style) {
    case 'height':
      return context.size ? heights[context.size] : rem(36);
    case 'borderColor':
      if (context.btnType) {
        return context.danger ? context.theme.colors.danger : borderColors[context.btnType];
      }
      return context.danger ? context.theme.colors.danger : 'transparent';
    case 'background':
      if (context.btnType) {
        return context.danger ? context.theme.colors.danger : backgroundColors[context.btnType];
      }
      return context.theme.colors.gray;
    case 'textColor':
      if (context.btnType) {
        return context.btnType === 'text' ? context.theme.colors.primary : '#fff';
      }
      return context.danger ? context.theme.colors.danger : context.theme.colors.text;
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
  border-radius: ${rem(4)};
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
    background-color: ${_ => (buttonStyle('background')(_) === 'transparent' ? 'transparent' : rgba(buttonStyle('background')(_), 0.8))};
    /* border-color: ${_ => (buttonStyle('borderColor')(_) === 'transparent' ? 'transparent' : rgba(buttonStyle('borderColor')(_), 0.8))}; */
  }
  &:active {
    background-color: ${_ => (buttonStyle('background')(_) === 'transparent' ? 'transparent' : rgba(buttonStyle('background')(_), 0.9))};
    /* border-color: ${_ => (buttonStyle('borderColor')(_) === 'transparent' ? 'transparent' : rgba(buttonStyle('borderColor')(_), 0.9))}; */
  }
`;

export const TextButton = styled(StyleButton)<IBtnIProp>`
  background: transparent;
  border-color: transparent;
  color: ${_ => (_.danger ? theme('colors.danger')(_) : theme('colors.primary')(_))};
  &:hover {
    background: ${_ => rgba(_.danger ? theme('colors.danger')(_) : theme('colors.primary')(_), 0.2)};
  }
  &:active {
    background: ${_ => rgba(_.danger ? theme('colors.danger')(_) : theme('colors.primary')(_), 0.16)};
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
