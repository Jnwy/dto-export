import { ListResultI } from "../dynamicTable";

export interface GenListResultI extends ListResultI {

  id: string;

  sequence: number;

  title: string;

  cover: string;

  price: number;

  tags: string[];

  createDate: Date;

  isPublish: boolean;

}