export interface ListResultI {
  id: string;
}

export interface TableResultI<T extends ListResultI> {
  result: Array<T>;
  count: number;
}

export interface AdvertisementListResultI extends ListResultI {
  id: string;
  visual: string;
  page: string;
  type: string;
  name: string;
  publishTime: string;
  removeTime: string;
  createTime: string;
  updateTime: string;
}

export interface GenreListResultI extends ListResultI {
  id: string;

  isPublish: boolean;

  count: number;

  nameCn: string;

  nameEn: string;

  sequence: number;

  updateTime: string;
}

export interface AddUnderGamesResultI extends ListResultI {
  id: string;

  cover: string;

  gameName: string;

  sequence: number;

  systemDefault: string;

  genre: string;
}

export interface AddTopGamesResultI extends ListResultI {
  id: string;

  ranking: number;

  cover: string;

  gameName: string;

  playTimes: number;

}

export interface GearListResultI extends ListResultI {
  id: string;
  sequence: number;
  visual: string;
  title: string;
  createTime: string;
  updateTime: string;
}

export interface CoinDiscountListResultI extends ListResultI {
  id: string;
  // sequence: number;
  campaignName: string;
  coinPackage: string;
  publishTime: string;
  removeTime: string;
  createTime: string;
  updateTime: string;
}

export interface CoinDiscountListResultI extends ListResultI {
  id: string;
  // sequence: number;
  campaignName: string;
  coinPackage: string;
  publishTime: string;
  removeTime: string;
  createTime: string;
  updateTime: string;
}

export interface SceneListResultI extends ListResultI {
  id: string;
  sequence: number;
  name: string;
  isPublish: boolean;
  cover: string;
  count: number;
  updateTime: string;
}

export interface TopGamesListResultI extends ListResultI {
  id: string;
  top: number;
  name: string;
  cover: string;
  playTimes: number;
  publishTime: string;
  removalTime: string;
}