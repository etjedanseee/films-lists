import { ISearchDataItem } from "./search";

export interface IDataItemWithLinks extends ISearchDataItem {
  id: number,
  listId: number,
  links: string[],
}

export interface DataState {
  data: IDataItemWithLinks[],
}

export enum DataActionTypes {
  SET_DATA = 'SET_DATA',
}

interface setData {
  type: DataActionTypes.SET_DATA,
  payload: IDataItemWithLinks[],
}

export interface IDataAdditionalInfo {
  genres: string[],
  overview: string,
  runtime: number,
}

export type DataAction = setData