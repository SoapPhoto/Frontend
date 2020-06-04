import { IPaginationList } from './global';
import { PictureEntity } from './picture';

export type TagEntity = import('@common/types/modules/tag/tag.entity').TagEntity;

export type GetTagPictureListDto =
  MutableRequired<Omit<import('@common/types/modules/tag/dto/tag.dto').GetTagPictureListDto, 'time'>>;

export type ITagPictureListRequest = IPaginationList<PictureEntity>;
