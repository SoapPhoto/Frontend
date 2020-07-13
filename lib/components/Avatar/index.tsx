import { rem } from 'polished';
import React from 'react';
import styled, { css } from 'styled-components';
import LazyLoad from 'react-lazyload';
import { StrutAlign, BadgeCert } from '@lib/icon';

import { server } from '@lib/common/utils';
import { BadgeEntity } from '@lib/common/interfaces/badge';
import { getPictureUrl } from '@lib/common/utils/image';
import { theme } from '@lib/common/utils/themes';
import { Image } from '../Image';

export interface IAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 头像路径
   *
   * @type {string}
   * @memberof IAvatarProps
   */
  src: string;
  /**
   * 尺寸： `24` `32` `48`
   *
   * @type {number}
   * @memberof IAvatarProps
   */
  size?: number;

  /**
   * 是否懒加载
   *
   * @type {boolean}
   * @memberof IAvatarProps
   */
  lazyload?: boolean;

  rainbow?: boolean;

  badge?: BadgeEntity[];
}

const Wrapper = styled.div<{ size: number }>`
  position: relative;
  width: ${props => rem(props.size)};
  height: ${props => rem(props.size)};
  min-width: ${props => rem(props.size)};
  min-height: ${props => rem(props.size)};
`;


const Img = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  background-color: ${theme('colors.gray1')};
`;

const Box = styled.span<{ isClick: boolean, rainbow: number }>`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  display: inline-block;
  font-size: 0;
  overflow: hidden;
  border: 2px solid #eee;
  line-height: 0;
  /* background: #fff; */
  user-select: none;
  ${props => props.isClick && 'cursor: pointer;'}
  ${_ => (_.rainbow ? css`
    border: none;
    ::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      z-index: 0;
      background-image: linear-gradient(40deg,#f99b4a,#df376b 74%,#c52d91)!important;
    }
    ${Img} {
      position: relative;
      z-index: 1;
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border: 2px solid ${theme('colors.background')};
      margin: 2px;
    }
  ` : '')}
`;
const BadgeBox = styled.div`
  position: absolute;
`;

export const Avatar: React.FC<IAvatarProps> = ({
  src,
  size = 40,
  onClick,
  rainbow = false,
  lazyload = false,
  ...restProps
}) => (
  <Wrapper {...restProps} size={size}>
    <Box rainbow={rainbow ? 1 : 0} onClick={onClick} isClick={!!onClick}>
      {
        (lazyload || server) ? (
          <LazyLoad once resize offset={400}>
            <Img src={getPictureUrl(src, 'thumb')} />
          </LazyLoad>

        ) : (
          <Img src={getPictureUrl(src, 'thumb')} />
        )
      }
    </Box>
    {/* {
      badge && badge.find(v => v.name === 'user-cert') && (
        <BadgeBox style={{ bottom: rem(-(size / 60)), right: rem(-(size / 60)) }}>
          <StrutAlign>
            <BadgeCert size={Math.max(size / 4, 16)} />
          </StrutAlign>
        </BadgeBox>
      )
    } */}
  </Wrapper>
);
