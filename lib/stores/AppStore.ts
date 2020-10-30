import {
  action, makeAutoObservable, observable, reaction, runInAction,
} from 'mobx';

import NProgress from 'nprogress';
import { CollectionEntity, ICollectionListRequest } from '@lib/common/interfaces/collection';
import { UserEntity } from '@lib/common/interfaces/user';
import { queryToMobxObservable } from '@lib/common/apollo';
import { ApolloClient } from 'apollo-boost';
import { UserCollectionsByName } from '@lib/schemas/query';
import { store } from './init';

export enum RouterAction {
  POP = 'POP',
  PUSH = 'PUSH',
  REPLACE = 'REPLACE',
}

interface ILocation {
  href: string;
  options?: {
    shallow?: boolean;
    [key: string]: any;
  };
  as: string;
  action: RouterAction;
}

export class AppStore {
  public client!: ApolloClient<any>;

  public userCollection = observable.array<CollectionEntity>([])

  public collectionLoading = true

  public loading = false;

  public location?: ILocation;

  public userList: Map<string, UserEntity> = new Map();

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.loading,
      (loading: boolean) => {
        if (loading) {
          NProgress.start();
        } else {
          NProgress.done();
        }
      },
    );
  }

  public setClient = (client: ApolloClient<any>) => this.client = client;

  public setLoading = (value: boolean) => this.loading = value

  public setRoute = (value: ILocation) => {
    this.location = value;
  }

  public getCollection = async () => {
    const { accountStore } = store;
    if (accountStore.userInfo) {
      await queryToMobxObservable(this.client.watchQuery<{userCollectionsByName: ICollectionListRequest}>({
        query: UserCollectionsByName,
        variables: {
          username: accountStore.userInfo.username,
        },
        fetchPolicy: 'cache-and-network',
      }), (data) => {
        runInAction(() => {
          this.userCollection.replace(data.userCollectionsByName.data);
          this.collectionLoading = false;
        });
      });
      // const { data } = await getUserCollection(accountStore.userInfo.username);
      // runInAction(() => this.userCollection.replace(data.data));
    }
  }

  public addCollection = (data: CollectionEntity) => this.userCollection.unshift(data)
}
