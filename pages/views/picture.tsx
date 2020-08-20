import Head from 'next/head';
import React, {
  useEffect, useCallback, useState, useMemo, useRef,
} from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getTitle, Histore, server } from '@lib/common/utils';
import {
  Avatar, GpsImage, EmojiText, LightBox, SEO,
} from '@lib/components';
import { Comment } from '@lib/components/Comment';
import { PictureInfo } from '@lib/components/PictureInfo';
import { PictureImage } from '@lib/containers/Picture/Image';
import {
  StrutAlign, Hash, Clock, ThumbsUp, Zap, MessageSquare, Heart, Target,
} from '@lib/icon';
import {
  BaseInfoItem,
  Bio,
  Content,
  GpsContent,
  PictureBox,
  TagBox,
  Title,
  UserHeader,
  UserInfo,
  UserLink,
  UserName,
  Wrapper,
  MapIcon,
  PictureWrapper,
  UserHeaderWrapper,
  UserHeaderHandleBox,
  LocationBox,
  TagA,
  CommentWrapper,
  TimeSpan,
  Choice,
  PictureContent,
  ChoiceBox,
  UserHeaderInfo,
  RelateCollectionBox,
  RelateCollection,
  RelateCollectionTitle,
  RelateCollectionList,
} from '@lib/styles/views/picture';
import { rem } from 'polished';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore, useScreenStores } from '@lib/stores/hooks';
import { observer } from 'mobx-react';
import { getPictureUrl, formatLocationTitle } from '@lib/common/utils/image';
import dayjs from 'dayjs';
import { Popover } from '@lib/components/Popover';
import { FollowButton } from '@lib/components/Button/FollowButton';
import { useFollower } from '@lib/common/hooks/useFollower';
import { errorFilter } from '@lib/common/utils/error';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { CollectionItem } from '@lib/containers/Collection/Item';
import { useQuery } from 'react-apollo';
import { PictureRelatedCollection } from '@lib/schemas/query';
import { CollectionEntity } from '@common/types/modules/collection/collection.entity';
import { OverflowChangedArgs } from 'overlayscrollbars';

interface IInitialProps extends IBaseScreenProps {
  screenData: PictureEntity;
}

const show = false;

// eslint-disable-next-line func-names
const onScrollCallback = function (this: OverlayScrollbars) {
  const { padding } = this.getElements();
  const scrollInfo = this.scroll();
  const gradientTop = padding.querySelector('#theme-demo-plugin-four-graidient-left') as any;
  const gradientBot = padding.querySelector('#theme-demo-plugin-four-graidient-right') as any;
  if (!gradientTop) return;
  if (show) {
    if (scrollInfo.ratio.x > 0) {
      gradientTop.style.opacity = 1;
    } else {
      gradientTop.style.opacity = 0;
    }
    if (scrollInfo.ratio.x < 1) {
      gradientBot.style.opacity = 1;
    } else {
      gradientBot.style.opacity = 0;
    }
  } else {
    gradientTop.style.opacity = 0;
    gradientBot.style.opacity = 0;
  }
};

const Picture: ICustomNextPage<IInitialProps, any> = observer(() => {
  const { userInfo } = useAccountStore();
  const { pictureStore } = useScreenStores();
  const { t } = useTranslation();
  const [follow, followLoading] = useFollower();
  const [boxVisible, setBoxVisible] = useState(false);
  const [commentLoading, setCommentLoading] = useState(true);
  const scrollRef = useRef<OverlayScrollbarsComponent>(null);
  // const [];
  const {
    info, like, getComment, comment, addComment, updateInfo, deletePicture, isCollected, setPicture, watch,
  } = pictureStore;
  const { user, tags, bio } = info;
  const isOwner = (userInfo && userInfo.id.toString() === user.id.toString()) || false;
  // const { loading, error, data } = useQuery<{pictureRelatedCollection: {count: number, data: CollectionEntity[]}}>(PictureRelatedCollection, {
  //   variables: {
  //     id: info.id,
  //   },
  // });

  useEffect(() => {
    (async () => {
      setCommentLoading(true);
      try {
        await getComment();
      } finally {
        setCommentLoading(false);
      }
      const clear = watch();
      return () => clear();
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);

  const isLocation = info.exif && info.exif.location && info.exif.location.length > 0;
  const onConfirm = async (value: string, commentId?: number) => {
    await addComment(value, commentId);
  };
  const onOk = useCallback((picture: PictureEntity) => {
    updateInfo(picture);
  }, [updateInfo]);
  const openLightBox = useCallback(() => {
    // setBoxVisible(true);
  }, []);
  const closeLightBox = useCallback(() => {
    setBoxVisible(false);
  }, []);
  const deletes = useCallback(async () => {
    await deletePicture();
    // 删除后返回用户首页
    window.location.href = `/@${user.username}`;
  }, [deletePicture, user.username]);

  const title = useMemo(() => getTitle(`${info.title} (@${user.name})`, t), [info.title, t, user.name]);

  const locationTitle = useMemo(() => {
    if (info?.location) {
      return formatLocationTitle(info.location);
    }
    return '';
  }, [info?.location]);

  const num = useMemo(() => info.width / info.height, [info.height, info.width]);

  const setScrollType = useCallback((target: HTMLDivElement) => {
    const isTop = target.scrollLeft === 0;
    const isBottom = target.scrollLeft + target.clientWidth === target.scrollWidth;
    const isCenter = target.scrollLeft + target.clientWidth !== target.scrollWidth;
    console.log(isTop, isBottom, isCenter);
  }, []);

  return (
    <Wrapper>
      <Head>
        <meta property="weibo:image:full_image" content={getPictureUrl(info.key, 'full')} />
        <meta name="weibo:image:create_at" content={info.createTime.toString()} />
        <meta name="weibo:image:update_at" content={info.updateTime.toString()} />
        <link rel="shortcut icon" type="image/jpg" href={getPictureUrl(info.key, 'ico')} />
      </Head>
      <SEO
        title={title}
        itemprop={{
          image: `http:${getPictureUrl(info.key, 'itemprop')}`,
        }}
        description={`${bio ? `${bio}-` : ''}${user.name}所拍摄的照片。`}
        openGraph={{
          type: 'image',
          url: `${process.env.URL}/picture/${info.id}`,
          title,
          description: `${bio ? `${bio}-` : ''}${user.name}所拍摄的照片。`,
          images: [
            {
              url: `http:${getPictureUrl(info.key, 'small')}`,
            },
          ],
        }}
      />
      <UserHeaderWrapper>
        <UserHeader columns={2}>
          <UserInfo width={1}>
            <UserLink route={`/@${user.username}`}>
              <Avatar
                style={{ marginRight: rem(14) }}
                src={user.avatar}
                badge={user.badge}
                size={44}
              />
            </UserLink>
            <div>
              <UserLink style={{ marginBottom: rem(4) }} route={`/@${user.username}`}>
                <UserName>
                  <EmojiText
                    text={user.fullName}
                  />
                </UserName>
              </UserLink>
              <BaseInfoItem>
                <Popover
                  openDelay={100}
                  trigger="hover"
                  placement="top"
                  theme="dark"
                  content={<span>{dayjs(info.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
                >
                  <TimeSpan>
                    {/* <StrutAlign>
                      <Clock size={14} />
                    </StrutAlign> */}
                    {dayjs(info.createTime).fromNow()}
                  </TimeSpan>
                </Popover>
              </BaseInfoItem>
            </div>
          </UserInfo>
          <UserHeaderHandleBox>
            <FollowButton
              disabled={followLoading}
              // size="small"
              user={user}
              isFollowing={info.user.isFollowing}
              onClick={() => follow(user)}
            />
          </UserHeaderHandleBox>
          {/* <UserHeaderInfo width={1}>
            <BaseInfoItem
              style={{ marginRight: rem(14) }}
            >
              <Target
                color="#57aae7"
                style={{ strokeWidth: 2.5 }}
                size={20}
              />
              <p>{info.views}</p>
            </BaseInfoItem>
            <BaseInfoItem
              style={{ marginRight: rem(14) }}
            >
              <Heart
                color="#e71a4d"
                style={{ strokeWidth: 2.5 }}
                size={20}
              />
              <p>{info.likedCount}</p>
            </BaseInfoItem>
            <BaseInfoItem>
              <MessageSquare
                color="#c155f4"
                style={{ strokeWidth: 2.5 }}
                size={20}
              />
              <p>{info.commentCount}</p>
            </BaseInfoItem>
          </UserHeaderInfo> */}
        </UserHeader>
      </UserHeaderWrapper>
      <PictureWrapper>
        <PictureContent>
          <PictureBox num={num} onClick={openLightBox}>
            {
              info.badge?.findIndex(v => v.name === 'choice') >= 0 && (
                <Popover
                  openDelay={100}
                  trigger="hover"
                  placement="top"
                  theme="dark"
                  content={<span>{t('label.choice')}</span>}
                >
                  <ChoiceBox style={{ position: 'absolute', zIndex: 3 }}>
                    <Zap color="#fff" size={20} />
                  </ChoiceBox>
                </Popover>
              )
            }
            <PictureImage fancybox lazyload={false} size="regular" detail={info} />
          </PictureBox>
        </PictureContent>
      </PictureWrapper>
      <Content>
        <PictureInfo
          info={info}
          isOwner={isOwner}
          onLike={like}
          onOk={onOk}
          deletePicture={deletes}
          isCollected={isCollected}
          setPicture={setPicture}
        />
        {
          info.title && (
            <Title>
              <EmojiText
                text={info.title}
              />
            </Title>
          )
        }
        {
          tags.length > 0 && (
            <TagBox>
              {
                tags.map(tag => (
                  <TagA
                    style={{ textDecoration: 'none' }}
                    route={`/tag/${tag.name}`}
                    key={tag.id}
                  >
                    <Hash size={14} />
                    {tag.name}
                  </TagA>
                ))
              }
            </TagBox>
          )
        }
        {
          info.bio && (
            <Bio>
              <EmojiText
                text={info.bio}
              />
            </Bio>
          )
        }
        {/* {
          isLocation && (
            <GpsContent>
              {
                locationTitle && (
                  <LocationBox>
                    <MapIcon size={14} />
                    {locationTitle}
                  </LocationBox>
                )
              }
              <GpsImage gps={info!.exif!.location!} />
            </GpsContent>
          )
        } */}
      </Content>
      {/* {
        data && data.pictureRelatedCollection && data.pictureRelatedCollection.count > 0 && (
          <RelateCollectionBox>
            <RelateCollection>
              <RelateCollectionTitle>包含此图片的收藏夹</RelateCollectionTitle>
              <OverlayScrollbarsComponent
                ref={scrollRef}
                options={{
                  scrollbars: { autoHide: 'move' },
                  callbacks: {
                    onScroll: onScrollCallback,
                    onInitialized() {
                      const { padding } = this.getElements();
                      const gradientBot = document.createElement('div');
                      const gradientTop = document.createElement('div');
                      gradientBot.id = 'theme-demo-plugin-four-graidient-left';
                      gradientTop.id = 'theme-demo-plugin-four-graidient-right';
                      padding.insertBefore(gradientBot, null);
                      padding.insertBefore(gradientTop, null);
                      onScrollCallback.call(this);
                    },
                    onOverflowChanged(e?: OverflowChangedArgs | null) {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      if (!e) {
                        show = false;
                      } else {
                        show = e.xScrollable && e.x;
                      }
                      onScrollCallback.call(this);
                    },
                  },
                }}
                style={{ paddingBottom: rem(12) }}
              >
                <RelateCollectionList>
                  {
                    data.pictureRelatedCollection.data.map(ct => (
                      <CollectionItem
                        count={false}
                        key={ct.id}
                        info={ct}
                      />
                    ))
                  }
                </RelateCollectionList>
              </OverlayScrollbarsComponent>
            </RelateCollection>
          </RelateCollectionBox>
        )
      } */}
      <CommentWrapper>
        <Comment id={info.id} author={info.user} onConfirm={onConfirm} comment={comment} loading={commentLoading} />
      </CommentWrapper>
      <LightBox
        visible={boxVisible}
        src={getPictureUrl(info.key, 'full')}
        onClose={closeLightBox}
        size={{
          width: info.width,
          height: info.height,
        }}
      />
    </Wrapper>
  );
});

Picture.getInitialProps = async ({
  mobxStore, route,
}: ICustomNextContext) => {
  try {
    const { params } = route;
    const { appStore } = mobxStore;
    // const isPicture = (
    //   mobxStore.screen.pictureStore.id
    //   && mobxStore.screen.pictureStore.id === Number(params.id || 0)
    // );
    let isPop = false;
    let isChild = false;
    if (appStore.location) {
      if (appStore.location.action === 'POP') isPop = true;
      const data = Histore!.get('modal');
      if (
        /^child/g.test(data)
      ) isChild = true;
    }
    if (isChild) return {};
    if (isPop) {
      await mobxStore.screen.pictureStore.getCache(Number(params.id!));
      return {};
    }
    await mobxStore.screen.pictureStore.getPictureInfo(Number(params.id!));
    return {};
  } catch (err) {
    return errorFilter(err);
  }
};

export default Picture;
