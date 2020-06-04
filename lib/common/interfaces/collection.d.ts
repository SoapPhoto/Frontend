import { IPaginationList } from './global';

export type CollectionEntity = import('@common/types/modules/collection/collection.entity').CollectionEntity;

export type ICollectionListRequest = IPaginationList<CollectionEntity>;

export type CreateCollectionDot = import('@common/types/modules/collection/dto/collection.dto').CreateCollectionDot;

export type UpdateCollectionDot = import('@common/types/modules/collection/dto/collection.dto').UpdateCollectionDot;

export type GetCollectionPictureListDto = MutableRequired<
Omit<import('@common/types/modules/collection/dto/collection.dto').GetCollectionPictureListDto, 'time'>
>;
