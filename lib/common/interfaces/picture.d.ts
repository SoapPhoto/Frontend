import { IPaginationList } from './global';

export type PictureEntity = import('@common/types/src/modules/picture/picture.entity').PictureEntity;

export type IPictureListRequest = IPaginationList<PictureEntity>;

export type CreatePictureAddDot = import('@common/types/src/modules/picture/dto/picture.dto').CreatePictureAddDot

export type UpdatePictureDot = import('@common/types/src/modules/picture/dto/picture.dto').UpdatePictureDot;

export type PictureLocation = import('@common/types/src/modules/picture/interface/location.interface').PictureLocation;

export type ImageClassify = import('@common/types/src/shared/baidu/interface/baidu.interface').BaiduClassify;

export interface IPictureLikeRequest {
  count: number;
  isLike: boolean;
}
