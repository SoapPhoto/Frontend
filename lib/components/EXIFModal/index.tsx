import bytes from 'bytes';
import { rgba, rem } from 'polished';
import React, {
  useEffect, useState, memo, useMemo,
} from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { getPictureUrl, formatLocationTitle } from '@lib/common/utils/image';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { Cell, Grid } from 'styled-css-grid';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import Modal from '../Modal';
import {
  EXIFBox, EXIFInfo, EXIFTitle, Info, Title,
} from './styles';
import { GpsImage } from '../GpsImage';

const isNull = (value: any) => value === undefined || value === null || value === '';

interface IProps {
  visible: boolean;
  onClose: () => void;
  themeStore?: ThemeStore;
  picture: PictureEntity;
}

export const EXIFModal: React.FC<IProps> = memo(({ visible, onClose, picture }) => {
  const { t } = useTranslation();
  const { styles } = useTheme();
  const {
    make, model, exif, width, height, size, key, location, info,
  } = picture;
  const {
    focalLength, aperture, exposureTime, ISO,
  } = exif!;
  const background = useMemo(() => (
    `linear-gradient(${rgba(styles.box.background, 0.8)}, ${styles.box.background} 150px), url("${getPictureUrl(key, 'blur')}")`
  ), [key, styles.box.background]);
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      maxWidth={500}
      boxStyle={{ padding: 0 }}
    >
      <Modal.Background background={background} />
      <Modal.Content>
        <Title>{t('picture.info.title')}</Title>
        <Info>
          <EXIFBox columns="repeat(auto-fit, minmax(150px, 1fr))">
            <Cell>
              <EXIFTitle>{t('picture.info.make')}</EXIFTitle>
              <EXIFInfo>{isNull(make) ? '--' : make}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>{t('picture.info.model')}</EXIFTitle>
              <EXIFInfo>{isNull(model) ? '--' : model}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>{t('picture.info.focalLength')}</EXIFTitle>
              <EXIFInfo>{isNull(focalLength) ? '--' : `${focalLength}mm`}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>{t('picture.info.aperture')}</EXIFTitle>
              <EXIFInfo>{isNull(aperture) ? '--' : `f/${aperture}`}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>{t('picture.info.exposureTime')}</EXIFTitle>
              <EXIFInfo>{isNull(exposureTime) ? '--' : `${exposureTime}s`}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>{t('picture.info.ISO')}</EXIFTitle>
              <EXIFInfo>{isNull(ISO) ? '--' : ISO}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>{t('picture.info.dimensions')}</EXIFTitle>
              <EXIFInfo>{`${width} x ${height}`}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>{t('picture.info.size')}</EXIFTitle>
              <EXIFInfo>{bytes(size)}</EXIFInfo>
            </Cell>
          </EXIFBox>
          {
            location && (
              <Grid
                style={{ marginTop: rem(24) }}
                columns="repeat(auto-fit, minmax(150px, 1fr))"
              >
                <Cell>
                  <EXIFTitle>位置</EXIFTitle>
                  <EXIFInfo>{formatLocationTitle(location)}</EXIFInfo>
                </Cell>
              </Grid>
            )
          }
          {
            exif?.location && (
              <div style={{ borderRadius: '4px', marginTop: rem(32) }}>
                <GpsImage zoom={14} size="500x200" gps={exif.location} />
              </div>
            )
          }
        </Info>
      </Modal.Content>
    </Modal>
  );
});
