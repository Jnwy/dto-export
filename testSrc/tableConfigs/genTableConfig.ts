// TypeScript Handlebars Template
import { ColumnType, TableColumnType, TableConfig } from "../testSrc/interface/dynamicTable";
import { genListResultI } from "../testSrc/interface/listResults.ts/genListResult";

export const genTableColumn: TableColumnType<genListResultI>[] = [
  { name: 'Test', key: 'test', type: ColumnType.CONTENT, width: 184, sort: true },
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

  export const genSystemTableConfig: TableConfig<genListResultI> = {
    tableId: 'gen',
    columns: genTableColumn,
    };