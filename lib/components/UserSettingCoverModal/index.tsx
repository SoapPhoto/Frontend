import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { rem } from 'polished';
import styled from 'styled-components';

import { getImageUrl } from '@lib/common/utils/image';
import { customMedia } from '@lib/common/utils/mediaQuery';
import { theme } from '@lib/common/utils/themes';
import { X, Image } from '@lib/icon';
import { observer } from 'mobx-react';
import { useTranslation } from '@lib/i18n/useTranslation';
import { Upload } from '@lib/components/Upload';
import { UpdateCover } from '@lib/schemas/mutations';
import { UploadType } from '@common/enum/upload';
import { uploadOSS } from '@lib/services/file';
import { useApolloClient } from 'react-apollo';
import { UserEntity } from '@lib/common/interfaces/user';
import { IconButton, Button } from '../Button';
import { Modal } from '..';
import Toast from '../Toast';

interface IProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
  cover?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${rem(14)};
  border-bottom: 1px solid ${theme('colors.shadowColor')};
`;


const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
`;

const XButton = styled(X)`
  color: ${theme('colors.text')};
`;

const Cover = styled(Upload)`
  position: relative;
  color: ${theme('colors.secondary')};
  background-color: ${theme('colors.gray1')};
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
`;

const Handle = styled.div`
  padding: ${rem(12)};
  > button {
    width: 100%;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Mask = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  z-index: 1;
  background-color: rgba(0,0,0,.32);
  color: #fff;
`;

export const UserSettingCoverModal = observer<React.FC<IProps>>(({
  visible, onClose, userId, cover,
}) => {
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();
  const [url, setUrl] = useState(cover || '');
  const coverFile = useRef<File>();
  const { t } = useTranslation();
  const handleAvatarChange = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      const src = getImageUrl(files[0]);
      [coverFile.current] = (files as any) as File[];
      setUrl(src);
    }
  }, []);
  const afterClose = useCallback(() => {
    setUrl(cover || '');
    setLoading(false);
  }, [cover]);
  const handle = useCallback(async () => {
    if (coverFile.current) {
      setLoading(true);
      try {
        const key = await uploadOSS(coverFile.current, userId, UploadType.USER_COVER);
        await client.mutate<{updateCover: any}>({
          mutation: UpdateCover,
          variables: {
            cover: key,
          },
        });
        onClose();
      } catch {
        Toast.error('设置失败！');
        setLoading(false);
      }
    }
  }, [client, onClose, userId]);
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      afterClose={afterClose}
      closeIcon={false}
      maxWidth={400}
      fullscreen={false}
      centerd
      boxStyle={{ padding: 0 }}
    >
      <Wrapper>
        <Header>
          <Title>设置封面</Title>
          <IconButton onClick={onClose}>
            <XButton />
          </IconButton>
        </Header>
        <Cover onFileChange={handleAvatarChange}>
          {
            url && (
              <Img src={url} />
            )
          }
          {
            url ? (
              <Mask>
                <Image size={26} />
                上传图片
              </Mask>
            ) : (
              <>
                <Image size={26} />
                上传图片
              </>
            )
          }
        </Cover>
        <Handle>
          <Button
            loading={loading}
            disabled={!(url && url !== cover)}
            type="primary"
            onClick={handle}
          >
            设置

          </Button>
        </Handle>
      </Wrapper>
    </Modal>
  );
});
