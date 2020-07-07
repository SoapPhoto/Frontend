import React from 'react';
import { Loading } from '../Loading';
import {
  LoadingBox, StyleButton, TextButton, ShapeButton,
} from './styles';

export * from './LikeButton';
export * from './IconButton';
export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 加载中
   *
   * @type {boolean}
   * @memberof IButtonProps
   */
  loading?: boolean;
  icon?: React.ReactNode;
  danger?: boolean;
  text?: boolean;
  shape?: 'circle' | 'round';
  size?: 'small' | 'large';
}

export const Button: React.FC<IButtonProps> = ({
  children,
  loading = false,
  danger,
  text,
  shape,
  icon,
  ...restProps
}) => {
  // console.log(children);
  const props = {
    ...restProps,
    danger: danger ? 1 : 0,
    loading: loading ? 1 : 0,
  };
  const content = (
    <>
      {
        loading && <LoadingBox><Loading color="#fff" /></LoadingBox>
      }
      {icon}
      {
        children && (
          <span>
            {children}
          </span>
        )
      }
    </>
  );
  if (text) {
    return (
      <TextButton
        {...props}
      >
        {content}
      </TextButton>
    );
  } if (shape) {
    return (
      <ShapeButton
        {...props}
        shape={shape}
      >
        {content}
      </ShapeButton>
    );
  }
  return (
    <StyleButton
      {...props}
    >
      {content}
    </StyleButton>
  );
};
