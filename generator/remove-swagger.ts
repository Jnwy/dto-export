import chalk from "chalk";

const path = require('path');
const fs = require('fs');



function removeApiProperty(filePath: string) {
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  // 移除 import { xxx } from '@nestjs/swagger' 及其後的換行符
  fileContent = fileContent.replace(/import {.*} from ["']@nestjs\/swagger["'];\s*\n?/, '');

  // 移除 @ApiProperty decorators
  fileContent = fileContent.replace(/@ApiProperty\((\{[^{}]*\}|[^()]*)\)\s*/gm, '');

  // 移除 @ApiPropertyOptional decorators
  fileContent = fileContent.replace(/@ApiPropertyOptional\([\s\S]*?\)\s*/g, '');

 // remove extends class
  fileContent = fileContent.replace(/extends[\s\S]*?\)\s*/g, '');

  // 取得 import 的 class，比對整個程式碼，如果沒有再被使用到，則移除 import
  const importClasses = fileContent.match(/import {.*} from ['"].*['"];/g);
  if (importClasses) {
    importClasses.forEach((importClass: string) => {
      const className = importClass.match(/{(.*)}/)[1];
      // className可能是多個，以逗號分隔
      const classNames = className.split(',').map((name: string) => name.trim());
      classNames.forEach((name: string) => {
        console.log(name);
        const reg = new RegExp(name, 'g');
        if (fileContent.match(reg)) {
          fileContent = fileContent.replace(importClass, '');
        }
      });      
    });
  }

  // console.log(chalk.blue('filePath: '), chalk.yellowBright(filePath));

  fs.writeFileSync(filePath, fileContent);
}

export async function processRemoveSwagger(folderPath: string) {
  const files = await fs.readdirSync(folderPath);
  files.forEach(async (file: any) => {
    const filePath = path.join(folderPath, file);
    const stat = await fs.statSync(filePath);
    if (stat.isDirectory()) {
      processRemoveSwagger(filePath);
    } else if (filePath.endsWith('.dto.ts')) {
      try {
        removeApiProperty(filePath);
      } catch (error) {
        console.error(chalk.red('Remove swagger error: '), error);
      }
    }
  });
}
