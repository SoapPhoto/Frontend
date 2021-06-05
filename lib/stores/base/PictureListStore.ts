import {
  makeObservable,
  runInAction,
} from 'mobx';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { LikePicture, UnLikePicture } from '@lib/schemas/mutations';
import Fragments from '@lib/schemas/fragments';
import { apolloErrorLog } from '@lib/common/utils/error';
import { ListStore, IListStoreData } from './ListStore';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IPictureListData<T> extends IListStoreData<T> {

}

export class PictureListStore<Query = unknown> extends ListStore<PictureEntity, Query> {
  constructor(data: IPictureListData<Query>) {
    super(data);
    makeObservable(this);
  }

  public like = async (picture: PictureEntity) => {
    try {
      let req: PictureEntity;
      if (!picture.isLike) {
        const { data } = await this.client.mutate<{likePicture: PictureEntity}>({
          mutation: LikePicture,
          variables: {
            id: picture.id,
          },
        });
        req = data!.likePicture;
      } else {
        const { data } = await this.client.mutate<{unlikePicture: PictureEntity}>({
          mutation: UnLikePicture,
          variables: {
            id: picture.id,
          },
        });
        req = data!.unlikePicture;
      }
      const cacheData = this.client.readFragment<PictureEntity>({
        fragment: Fragments,
        fragmentName: 'PictureFragment',
        id: `Picture:${picture.id}`,
      });
      if (cacheData) {
        this.client.writeFragment<PictureEntity>({
          fragment: Fragments,
          fragmentName: 'PictureFragment',
          id: `Picture:${picture.id}`,
          data: {
            ...cacheData,
            isLike: req.isLike,
            likedCount: req.likedCount,
          } as PictureEntity,
        });
      }
      runInAction(() => {
        picture.isLike = req.isLike;
        picture.likedCount = req.likedCount;
      });
    // tslint:disable-next-line: no-empty
    } catch (err) {
      apolloErrorLog(err);
    }
  }
}
