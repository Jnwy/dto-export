// TypeScript Handlebars Template
import { ColumnType, TableColumnType, TableConfig } from "../interface/dynamicTable";
import { GenListResultI } from "../interface/listResults/genListResult";
import { RequestMethod } from 'shared/constants/enums';
import { postData } from "utils/api/requestHelper";

export const genTableColumn: TableColumnType<GenListResultI>[] = [
  { name: 'Id', key: 'id', type: ColumnType.CONTENT, width: 184, sort: true },
  { name: 'Sequence', key: 'sequence', type: ColumnType.INDEX, width: 68 },
  { name: 'Title', key: 'title', type: ColumnType.CONTENT, width: 184, sort: true },
  { name: 'Cover', key: 'cover', type: ColumnType.CONTENT, width: 184, sort: true },
  { name: 'Price', key: 'price', type: ColumnType.CONTENT, width: 184, sort: true },
  { name: 'Tags', key: 'tags', type: ColumnType.CONTENT, width: 184, sort: true },
  { name: 'Create Date', key: 'createDate', type: ColumnType.CONTENT, width: 184, sort: true },
  {
    name: 'Publish',
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

  // Default Column
  { name: '', type: ColumnType.EDIT, width: 84 },
  { name: '', type: ColumnType.DELETE, width: 84 },
  { name: '', type: ColumnType.BLANK, width: '100%' },
  ];

  export const genSystemTableConfig: TableConfig<GenListResultI> = {
    tableId: 'gen',
    columns: genTableColumn,
    };