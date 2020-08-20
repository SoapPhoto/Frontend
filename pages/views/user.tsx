import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import parse from 'url-parse';
import { Cell } from 'styled-css-grid';
import { useRouter as useBaseRouter } from 'next/router';
import qs from 'querystring';

import { IBaseScreenProps, ICustomNextPage, ICustomNextContext } from '@lib/common/interfaces/global';
import { getTitle, Histore } from '@lib/common/utils';
import {
  Nav, NavItem, EmojiText, SEO,
} from '@lib/components';
import { PictureList } from '@lib/containers/Picture/List';
import {
  Link as LinkIcon, StrutAlign, Edit, UploadCloud,
} from '@lib/icon';
import { UserFollowModal } from '@lib/components/UserFollowModal';
import {
  Bio,
  EditIcon,
  Profile,
  ProfileItem,
  ProfileItemLink,
  UserHeader,
  UserName,
  Wrapper,
  HeaderGrid,
  AvatarBox,
  Info,
  InfoItem,
  InfoItemCount,
  InfoItemLabel,
  InfoBox,
  AvatarContent,
  Avatar,
  FollowBox,
  UserHeaderWrapper,
  Cover,
  CoverImage,
  CoverBtn,
} from '@lib/styles/views/user';
import { WithRouterProps } from 'next/dist/client/with-router';
import { A } from '@lib/components/A';
import { CollectionList } from '@lib/containers/Collection/List';
import { UserType } from '@common/enum/router';
import { useAccountStore, useStores } from '@lib/stores/hooks';
import { useTranslation } from '@lib/i18n/useTranslation';
import { FollowButton } from '@lib/components/Button/FollowButton';
import { useFollower } from '@lib/common/hooks/useFollower';
import { useRouter } from '@lib/router';
import { WithHashParam } from '@lib/components/WithHashParam';
import { IconButton } from '@lib/components/Button';
import { errorFilter } from '@lib/common/utils/error';
import { VipBadge } from '@lib/icon/VipBadge';
import { Popover } from '@lib/components/Popover';
import { UserSettingCoverModal } from '@lib/components/UserSettingCoverModal';
import { getPictureUrl } from '@lib/common/utils/image';
import Head from 'next/head';

interface IProps extends IBaseScreenProps, WithRouterProps {
  username: string;
  type: UserType;
}

interface IUserInfoProps {
  openModal: (type: string) => void;
}

const server = !!(typeof window === 'undefined');

// eslint-disable-next-line @typescript-eslint/ban-types
const User = observer<ICustomNextPage<IProps, {}>>(({ type }) => {
  const { screen } = useStores();
  const { t } = useTranslation();
  const { userStore, userCollectionStore } = screen;
  const { user } = userStore;
  return (
    <Wrapper>
      <Head>
        <link rel="shortcut icon" type="image/jpg" href={getPictureUrl(user.avatar, 'ico')} />
      </Head>
      <SEO
        title={getTitle(`${user.fullName} (@${user.username})`, t)}
        description={`${user.bio ? `${user.bio}-` : ''}查看${user.name}的Soap照片。`}
      />
      <UserInfo />
      <Nav style={{ textAlign: 'center' }}>
        <NavItem route={`/@${user.username}`}>
          {t('user.menu.picture')}
        </NavItem>
        <NavItem route={`/@${user.username}/like`}>
          {t('user.menu.like')}
        </NavItem>
        <NavItem route={`/@${user.username}/choice`}>
          {t('user.menu.choice')}
        </NavItem>
        <NavItem route={`/@${user.username}/collections`}>
          {t('user.menu.collection')}
        </NavItem>
      </Nav>
      {
        type === 'collections' ? (
          <CollectionList
            list={userCollectionStore.list}
            noMore={userCollectionStore.isNoMore}
          />
        ) : (
          <Picture />
        )
      }
    </Wrapper>
  );
});

const UserInfo = observer(() => {
  const {
    pathname, params,
  } = useRouter();
  const { push } = useBaseRouter();
  const [follow, followLoading] = useFollower();
  const { t } = useTranslation();
  const { screen } = useStores();
  const { isLogin, userInfo } = useAccountStore();
  const { userStore } = screen;
  const {
    user, watch, setUsername, username,
  } = userStore;
  const prestige = useMemo(() => !!user?.badge.find(v => v.name === 'prestige'), [user?.badge]);
  useEffect(() => {
    if (params.username !== username) {
      setUsername(params.username!);
    }
    const clear = watch();
    return () => clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.username]);
  const pushModalQuery = useCallback((label: string) => {
    push(`/views/user?${qs.stringify(params as any)}`, `${pathname}#modal-${label}`, {
      // shallow: true,
    });
    Histore.set('modal', `child-${label}`);
  }, [params, pathname, push]);
  const openModal = useCallback((type: string) => {
    pushModalQuery(type);
  }, [pushModalQuery]);
  const backNow = useCallback(() => {
    push(`/views/user?${qs.stringify(params as any)}`, pathname, {
      shallow: true,
    });
  }, [params, pathname, push]);
  const isOwner = useMemo(() => (userInfo && userInfo.id.toString() === user.id.toString()) || false, [user.id, userInfo]);
  const follower = useCallback(() => user && follow(user), [follow, user]);
  return (
    <UserHeaderWrapper>
      <Cover>
        {
          isOwner && (
            <CoverBtn
              transformTemplate={({ scale }: any) => `translate(0, 0) scale(${scale})`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => openModal('cover-setting')}
            >
              {
                user.cover ? (
                  <Edit size={16} />
                ) : (
                  <div style={{ margin: '0 24px' }}>设置封面</div>
                )
              }
            </CoverBtn>
          )
        }
        {
          user.cover && (
            <>
              <CoverImage src={getPictureUrl(user.cover, 'regular')} />
            </>
          )
        }
      </Cover>
      <UserHeader>
        <HeaderGrid columns="140px auto" gap="32px">
          <AvatarContent>
            <AvatarBox>
              {/* <Christmas size={64} /> */}
            </AvatarBox>
            <Avatar
              src={user.avatar}
              rainbow={prestige}
              badge={user.badge}
            />
          </AvatarContent>
          <Cell>
            <UserName>
              <div style={{ zIndex: 1 }}>
                {
                  user.badge.find(v => v.name === 'prestige') && (
                    <StrutAlign>
                      <Popover
                        openDelay={100}
                        trigger="hover"
                        placement="top"
                        theme="dark"
                        content={<span>至臻用户</span>}
                      >
                        <VipBadge style={{ marginRight: 6 }} size="1.2em" />
                      </Popover>
                    </StrutAlign>
                  )
                }
                <EmojiText
                  text={user.fullName}
                />
              </div>
              {
                isLogin && userInfo?.username === user.username && (
                  <A route="/setting/profile">
                    <IconButton>
                      <EditIcon size={26} />
                    </IconButton>
                  </A>
                )
              }
              {
                  userInfo?.username !== user.username && (
                  <FollowBox>
                    <FollowButton
                      disabled={followLoading}
                      user={user}
                      isFollowing={user.isFollowing}
                      onClick={follower}
                    />
                  </FollowBox>
                )
              }
            </UserName>
            {/* <Profile>
                {
                  user.website && (
                    <ProfileItem>
                      <ProfileItemLink href={user.website} target="__blank">
                        <LinkIcon size={14} />
                        {parse(user.website).hostname.replace(/^www./, '')}
                      </ProfileItemLink>
                    </ProfileItem>
                  )
                }
              </Profile> */}
            {/* {
                user.bio && (
                  <Bio>
                    {user.bio}
                  </Bio>
                )
              } */}
            <InfoBox>
              <Info>
                <InfoItem click={1} onClick={() => openModal('follower')}>
                  <InfoItemCount>{user.followerCount}</InfoItemCount>
                  <InfoItemLabel>{t('user.label.followers')}</InfoItemLabel>
                </InfoItem>
                <InfoItem click={1} onClick={() => openModal('followed')}>
                  <InfoItemCount>{user.followedCount}</InfoItemCount>
                  <InfoItemLabel>{t('user.label.followed')}</InfoItemLabel>
                </InfoItem>
                <InfoItem>
                  <InfoItemCount>{user.likesCount}</InfoItemCount>
                  <InfoItemLabel>{t('user.label.likes')}</InfoItemLabel>
                </InfoItem>
              </Info>
            </InfoBox>
          </Cell>
        </HeaderGrid>
        <WithHashParam action="modal-follower" back={backNow}>
          {(visible, backView) => (
            <UserFollowModal
              type="follower"
              userId={user.id}
              visible={visible}
              onClose={backView}
            />
          )}
        </WithHashParam>
        <WithHashParam action="modal-followed" back={backNow}>
          {(visible, backView) => (
            <UserFollowModal
              type="followed"
              userId={user.id}
              visible={visible}
              onClose={backView}
            />
          )}
        </WithHashParam>
        {
          isOwner && (
            <WithHashParam action="modal-cover-setting" back={backNow}>
              {(visible, backView) => (
                <UserSettingCoverModal
                  visible={visible}
                  userId={user.id}
                  onClose={backView}
                  cover={user.cover ? getPictureUrl(user.cover, 'regular') : undefined}
                />
              )}
            </WithHashParam>
          )
        }
      </UserHeader>
    </UserHeaderWrapper>
  );
});

const Picture = observer(() => {
  const { screen } = useStores();
  const { userPictureStore } = screen;
  const { type: PictureType, list } = userPictureStore;
  return (
    <PictureList
      noMore={list[PictureType].isNoMore}
      data={list[PictureType].list}
      like={list[PictureType].like}
      onPage={list[PictureType].getPageList}
    />
  );
});


User.getInitialProps = async ({
  mobxStore, route, res,
}: ICustomNextContext) => {
  const { params, query, pathname } = route;
  const { username, type } = params as { username: string; type: UserType };
  const { appStore, screen } = mobxStore;
  const { userCollectionStore, userPictureStore, userStore } = screen;
  const { location } = appStore;
  const all = [];
  const arg: [string, UserType] = [username!, type];
  const isPop = location && location.action === 'POP' && !server;
  if (query.modal) {
    // eslint-disable-next-line no-unused-expressions
    if (query.action !== 'follower' && query.action !== 'followed') res?.redirect(pathname);
  }
  userCollectionStore.setUsername(username!);
  userStore.setUsername(username!);
  if (isPop) {
    all.push(userStore.getCache(username));
  } else {
    all.push(userStore.getInit(...arg));
  }
  switch (type!) {
    case UserType.collections:
      all.push(
        userCollectionStore.getList(false),
      );
      break;
    default:
      all.push(isPop ? userPictureStore.getCache(...arg) : userPictureStore.getList(...arg));
  }
  try {
    await Promise.all(all);
    return {
      type,
      username: params.username,
      ico: userStore.user.avatar,
    };
  } catch (err) {
    return errorFilter(err);
  }
};

export default User;
