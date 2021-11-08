import { rem, rgba } from 'polished';
import styled, { css } from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';

import { href } from '@lib/common/utils/themes/common';
import { Settings } from '@lib/icon';
import { theme, initButton } from '@lib/common/utils/themes';
import { customMedia } from '@lib/common/utils/mediaQuery';
import { ChristmasHat } from '@lib/icon/ChristmasHat';
import { Image } from '@lib/components/Image';
import { Avatar as AvatarComp } from '@lib/components';
import { motion } from 'framer-motion';

export const Wrapper = styled.div``;

export const UserHeaderWrapper = styled.div`
  /* padding-bottom: ${rem(24)}; */
  padding: 0 ${rem(32)}
  /* box-shadow: inset 0px -1px 0px
    ${_ => _.theme.layout.header.shadowColor}; */
`;

export const UserHeader = styled.div`
  max-width: ${_ => rem(theme('width.header')(_))};
  width: 100%;
  margin: 0 auto;
  padding: 0 ${rem('20px')};
  margin-top: -${rem(58)};
  /* ${customMedia.lessThan('mobile')`
    margin: ${rem(32)} auto;
  `} */
`;

export const HeaderGrid = styled(Grid)`
  ${customMedia.lessThan('mobile')`
    grid-template-columns: 1fr;
    grid-gap: 4px;
  `}
`;

export const AvatarContent = styled(Cell)`
  display: flex;
  margin-top: -${rem(36)};
  ${customMedia.lessThan('mobile')`
    justify-content: center;
    margin-top: -${rem(12)};
  `}
`;

export const AvatarBox = styled(Cell)`
  position: relative;
`;

export const Avatar = styled(AvatarComp)`
  width: ${rem(140)};
  height: ${rem(140)};
  ${customMedia.lessThan('mobile')`
    width: ${rem(110)};
    height: ${rem(110)};
  `}
`;

export const UserName = styled.h2`
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  margin-top: ${rem('6px')};
  margin-bottom: ${rem('12px')};
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: ${rem(12)};
  color: #fff;
  ${customMedia.lessThan('mobile')`
    font-size: ${_ => rem(_.theme.fontSizes[4])};
    color: ${theme('colors.text')};
    justify-content: center;
    grid-template-columns: max-content max-content;
  `}
`;

export const FollowBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InfoBox = styled.div`
  margin-top: ${rem('6px')};
`;

export const Info = styled.div`
  display: flex;
  width: 100%;
  margin-left: ${rem(-12)};
  ${customMedia.lessThan('mobile')`
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    justify-content: space-around;
  `}
`;

export const InfoItem = styled.div<{click?: number}>`
  padding: 0 ${rem(12)};
  ${_ => (_.click ? css`
    cursor: pointer;
  ` : css``)}
  ${customMedia.lessThan('mobile')`
    display: flex;
    flex-direction: column;
    align-items: center;
  `}
`;

export const InfoItemCount = styled.span`
  font-size: ${_ => rem(20)};
  margin-right: ${rem(8)};
  font-weight: 600;
  font-family: ${theme('enFont')};
`;

export const InfoItemLabel = styled.span`
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
`;

export const Profile = styled.div`
  display: flex;
  margin-bottom: ${rem('4px')};
  ${customMedia.lessThan('mobile')`
    display: none;
  `}
`;

export const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${rem('24px')};
  min-width: 0;
  // font-family: ${theme('enFont')};
  color: ${theme('colors.secondary')};
  & svg {
    margin-right: ${rem('4px')};
  }
`;

export const ProfileItemLink = styled.a`
  display: flex;
  align-items: center;
  ${_ => href(_.theme.colors.secondary)}
`;

export const Bio = styled.p`
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  // font-family: ${theme('enFont')};
  color: ${theme('colors.secondary')};
  ${customMedia.lessThan('mobile')`
    text-align: center;
  `}
`;

export const EditIcon = styled(Settings)`
  stroke: ${theme('colors.secondary')};
`;

export const Christmas = styled(ChristmasHat)`
  position: absolute;
  top: -29px;
  left: -3px;
  transform: rotate(-41deg);
`;

export const Cover = styled.div`
  position: relative;
  height: ${rem(240)};
  max-width: ${rem(960)};
  margin: 0 auto;
  margin-top: ${rem(36)};
  border-radius: 16px;
  overflow: hidden;
  z-index: 0;
  background-color: ${theme('colors.gray1')};
  ${customMedia.lessThan('mobile')`
    height: ${rem(160)};
  `}
  ::after {
    z-index: 0;
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 23.44%, rgba(0, 0, 0, 0) 53.9%, rgba(0, 0, 0, 0.06) 72.97%, rgba(0, 0, 0, 0.44) 100%);
  }
`;

export const CoverImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
  &[src=""],&:not([src]){
    opacity:0;
  }
`;

export const CoverBtn = styled(motion.button)`
  ${initButton}
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: ${_ => rgba(_.theme.colors.pure, 0.8)};
  right: ${rem(12)};
  top: ${rem(12)};
  border-radius: ${rem(32)};
  height: ${rem(32)};
  color: ${theme('colors.secondary')};
  z-index: 1;
  @supports (backdrop-filter: saturate(180%) blur(20px)) {
    background-color: ${_ => rgba(_.theme.colors.pure, 0.8)};
    & { backdrop-filter: saturate(180%) blur(20px); }
  }
  svg {
    width: ${rem(32)};
  }
`;
