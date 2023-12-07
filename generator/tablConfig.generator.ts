import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { ColumnType } from '../testSrc/interface/dynamicTable';

/* const getPath = () => {
  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const root = path.resolve(resolvedProjectPath);
  const appName = path.basename(root);
  const folderExists = fs.existsSync(root);

  if (folderExists) {
    process.exit(1);
  }
}; */

export const genTableConfig = () => {
  /**
 * Generate tableConfig.json from handlebars
 */
  // 註冊heper
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });
  Handlebars.registerHelper('isBoolean', function (value, options) {
    return typeof value === 'boolean' ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper('typeof', function (value, type, options) {
    if (typeof value === type) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // 加載 Handlebars 模板
  const templatePath = path.join(process.cwd(), '/template/tableConfig.hbs');
  const tableConfigTemplate = fs.readFileSync(templatePath, 'utf-8');

  // 定義數據

  const tableName = 'gen';
  const columns = [
    { key: 'test', name: 'Test', type: ColumnType.CONTENT },
    { key: 'isPublish', name: 'Publish', type: ColumnType.SWITCH },
  ];

  const tableConfigData = { columns, tableName };

  // 編譯 Handlebars 模板
  const compiledTemplate = Handlebars.compile(tableConfigTemplate);

  // 合併數據與模版
  const tableConfigOutput = compiledTemplate(tableConfigData);

  const outputPath = path.join(__dirname, '../testSrc/tableConfigs', `${tableName}TableConfig.ts`);
  console.log(outputPath);

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, tableConfigOutput, 'utf-8');

};