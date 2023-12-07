import { ColumnType, TableColumnType, TableConfig } from "../testSrc/interface/dynamicTable";
import { GenListResultI } from "../testSrc/interface/listResults.ts/genListResult";

export const genTableColumn: TableColumnType<GenListResultI>[] = [
  {
    name: '',
    key: 'isPublish',
    label: 'Publish',
    type: ColumnType.SWITCH,
    handleChange: (event: any, id: string, checked: boolean) => {
      postData(`gen/${id}`,
        { isPublish: checked },
        true,
        RequestMethod.PATCH).then((result) => {
          console.log('refetch');
        });
    },
    width: 116,
  },
  { name: 'No.', key: 'sequence', type: ColumnType.INDEX, width: 68 },
  { name: 'Title', key: 'title', type: ColumnType.CONTENT, width: 184, sort: true },
  { name: 'Tags', key: 'tags', type: ColumnType.TAG, width: 300 },
  { name: 'Cover', key: 'cover', type: ColumnType.IMAGE, width: 100 },
  { name: 'Create Date', key: 'createDate', type: ColumnType.CONTENT, width: 134 },
  { name: '', type: ColumnType.EDIT, width: 84 },
  { name: '', type: ColumnType.DELETE, width: 84 },
  { name: '', type: ColumnType.BLANK, width: '100%' },
];

export const genSystemTableConfig: TableConfig<GenListResultI> = {
  tableId: 'gen',
  columns: genTableColumn
};