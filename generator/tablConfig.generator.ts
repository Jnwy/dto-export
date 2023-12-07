import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { ColumnType } from '../testSrc/interface/dynamicTable';

interface ColumnDataI {
  key: string;
  name: string;
  type: ColumnType;
}

interface TableConfigDataI {
  columns: ColumnDataI[];
  upperName: string;
  lowerName: string;
  listResultPath: string;
}

const configJsonData = fs.readFileSync(path.join(process.cwd(), 'tableconfig.json'), 'utf-8');
const configData = JSON.parse(configJsonData);

const listResultFolderPath = path.join(process.cwd(), configData.srcPath, configData.listResultPath);
const tableConfigPath = path.join(process.cwd(), configData.srcPath, configData.tableConfigPath);

export const genTableConfig = (tableConfigData: TableConfigDataI) => {
  /**
 * Generate tableConfig.ts from handlebars
 */
  // 註冊 heper
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


  // 編譯 Handlebars 模板
  const compiledTemplate = Handlebars.compile(tableConfigTemplate);

  // 合併數據與模版
  const tableConfigOutput = compiledTemplate(tableConfigData);

  const outputPath = path.join(tableConfigPath, `${tableConfigData.lowerName}TableConfig.ts`);
  console.log(outputPath);

  // 檢查文件是否存在
  if (!fs.existsSync(outputPath)) {
    const outputDir = path.dirname(outputPath);

    // 確保目錄存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 寫入文件
    fs.writeFileSync(outputPath, tableConfigOutput, 'utf-8');
  } else {
    console.log('檔案已存在，跳過寫入。');
  }


};

function readTypeScriptFiles(folderPath: string): string[] {
  const fileNames: string[] = [];
  const files = fs.readdirSync(folderPath);

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isFile() && file.endsWith('.ts')) {
      fileNames.push(filePath);
    }
  });

  return fileNames;
}

function destructureFileContent(filePath: string): TableConfigDataI {

  // 讀取 TypeScript 檔案內容
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  // console.log(fileContent);
  // 提取介面定義的內容
  const interfaceRegex = /export\s+interface\s+(\w+)\s*extends\s*(\w+)?\s*\{([^}]*)\}/;
  const match = fileContent.match(interfaceRegex);

  if (match) {
    const interfaceName = match[1].replace('ListResultI', '');
    const extendedInterface = match[2];
    const interfaceBody = match[3];

    // 提取鍵值對
    const keyValueRegex = /\s*(\w+)\s*:\s*(\w+(?:\[\])?)(?:\s*;|$)/g;

    let result: ColumnDataI[] = [];
    let keyValueMatch;

    while ((keyValueMatch = keyValueRegex.exec(interfaceBody)) !== null) {
      const key = keyValueMatch[1];
      const name = toTitleCase(key);
      const propType = keyValueMatch[2].trim();
      const type = getColumnType(key, propType);
      result.push({ key, name, type });
    }

    // 打印結果
    // console.log(`Interface Name: ${interfaceName}`);
    // console.log('Key Pair:');
    // console.log(properties);
    const upperName = interfaceName.charAt(0).toUpperCase() + interfaceName.slice(1);
    const lowerName = interfaceName.charAt(0).toLowerCase() + interfaceName.slice(1);
    const listResultPath = `../${configData.listResultPath}/${lowerName}ListResult`;
    console.log('listResultPath: ', listResultPath);
    return { upperName, lowerName, listResultPath, columns: result };
  } else {
    console.error('在檔案中找不到介面。');
  }
}
function toTitleCase(str: string): string {
  return str.replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  }).replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace('Is ', '');// Remove is of isXXX
}

export const genTableRun = () => {
  const listResultFiles = readTypeScriptFiles(listResultFolderPath);

  listResultFiles.forEach(file => {
    const columnData = destructureFileContent(file);
    // console.log(columnData);

    genTableConfig(columnData);
  });
};

const getColumnType = (key: string, type: string) => {
  if (key === 'sequence') {
    return ColumnType.INDEX;
  } else if (type === 'boolean') {
    return ColumnType.SWITCH;
  } else {
    return ColumnType.CONTENT;
  }
};

const getImportPath = (absolutePath: string) => {
  const currentWorkingDirectory = process.cwd();
  const relativePath = path.relative(currentWorkingDirectory, absolutePath);
  // 替換反斜杠為正斜杠
  const forwardSlashesPath = relativePath.replace(/\\/g, '/');
  // 確保以斜杠開頭
  const finalPath = forwardSlashesPath.startsWith('/') ? forwardSlashesPath : `/${forwardSlashesPath}`;

  return finalPath;
};