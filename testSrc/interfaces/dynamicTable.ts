
type PropertyMapper<T> = {
  [K in keyof T]: K;
};

type PropertyTypeFactory<T> = ((t: T | PropertyMapper<T>) => (string | any)[]);

export enum ColumnType {
  INDEX = 'index',
  CONTENT = 'content',
  IMAGE = 'image',
  SWITCH = 'switch',
  BLANK = 'blank',
  DELETE = 'delete',
  TAG = 'tag',
  MEDIA = 'media',
  EDIT = 'edit',
}

export interface TableConfig<T extends ListResultI, Q = never> {
  tableId: string;
  columns: TableColumn<T>[];
  unfilterFileds?: PropertyTypeFactory<Q>;
}

export type TableColumnType<T> =
  TableColumn<T> |
  TagTableColumn<T> |
  DeleteTableColumn<T> |
  SwitchTableColumn<T>;

export interface TableColumn<T> {
  name: string;
  key?: keyof T;
  entityKey?: string;
  width?: string | number;
  sort?: boolean;
  label?: string;
  end?: boolean;
  type?: ColumnType;
  sx?: any | undefined;
  align?: 'left' | 'right' | undefined;
  position?: 'start' | 'middle' | undefined;
}

/** Tags Column */
export interface TagTableColumn<T> extends TableColumn<T> {
  type: ColumnType.TAG;
  styles?: ColumnTagStyles;
}

export interface ColumnTagStyle {
  color: string;
  backgroundColor: string;
}

export interface ColumnTagStyles {
  [key: string]: ColumnTagStyle;
}
/** Tags Column end */

export interface DeleteTableColumn<T> extends TableColumn<T> {
  type: ColumnType.DELETE;
  handleChange?: (event: any, id: string, checked: boolean, ...args: any) => void;
}

export interface SwitchTableColumn<T> extends TableColumn<T> {
  type: ColumnType.SWITCH;
  handleChange?: (event: any, id: string, checked: boolean, ...args: any) => void;
}

export type AlignType = 'left' | 'right' | undefined;

export type PositionType = 'start' | 'middle' | undefined;

export interface ListResultI {
  id: string;
}

export interface TableResultI<T extends ListResultI> {
  result: Array<T>;
  count: number;
}