import chalk from "chalk";

const path = require('path');
const fs = require('fs');



function removeApiProperty(filePath: string) {
  let fileContent = fs.readFileSync(filePath, 'utf-8');
   // 移除 import { ApiProperty } from '@nestjs/swagger' 及其後的換行符
  fileContent = fileContent.replace(/import { ApiProperty } from '@nestjs\/swagger';\s*\n?/, '');

  // 移除 @ApiProperty decorators
  fileContent = fileContent.replace(/@ApiProperty\(.*?\)\s*/g, '');

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
