import chalk from "chalk";

const path = require('path');
const fs = require('fs');


function removePackageDecorator(fileContent: string, packageName: string) {
  // console.log(packageName);
  // console.log(fileContent);
  // 取得 import { xxx } from 'package'
  const importDecorators = fileContent.match(new RegExp(`import {.*} from ['"]${packageName}['"];`, 'g'))?.[0].match(/{(.*?)}/)[1].split(',').map((name: string) => name.trim());
  // console.log(importDecorators);
  if (!importDecorators) return fileContent;
  // 移除 import { xxx } from 'package' 及其後的換行符
  fileContent = fileContent.replace(new RegExp(`import {.*} from ["']${packageName}["'];\\s*\\n?`), '');
  // console.log(fileContent);
  // 移除 @xxx decorators
  importDecorators.forEach((importDecorator: string) => {
    // console.log(importDecorator);
    // const regex = new RegExp(`@${importDecorator}\(.*\)\s`, 'g');
    const regex = new RegExp(`@${importDecorator}\(.*\)\\s*\\n?`, 'g');
    fileContent = fileContent.replace(regex, '');
    // console.log(fileContent);
  });
  return fileContent;
}

function removeApiProperty(filePath: string) {
  let fileContent: string = fs.readFileSync(filePath, 'utf-8');
  // 移除 import { xxx } from '@nestjs/swagger' 及其後的換行符
  fileContent = fileContent.replace(/import {.*} from ["']@nestjs\/swagger["'];\s*\n?/, '');

  // 移除 @ApiProperty decorators
  fileContent = fileContent.replace(/@ApiProperty\((\{[^{}]*\}|[^()]*)\)\s*/gm, '');

  // 移除 @ApiPropertyOptional decorators
  fileContent = fileContent.replace(/@ApiPropertyOptional\([\s\S]*?\)\s*/g, '');

  // 移除 import { xxx } from 'class-transformer' 及其後的換行符，以及所有 @xxx decorators
  fileContent = removePackageDecorator(fileContent, 'class-transformer');
  // console.log(fileContent);

  // Remove the import statements for all @nestjs classes
  const importClasses = fileContent.match(/import {.*} from ['"]@nestjs\/.*['"];/g);
  // console.log(importClasses);
  if (importClasses) {
    importClasses.forEach((importClass: string) => {
      const classNames = importClass.match(/{(.*?)}/)[1].split(',').map((name: string) => name.trim());
      classNames.forEach((className: string) => {
        // const extendsReg = new RegExp(`extends\\s+${className}\\s*`, 'g');
        // console.log(className);
        const extendsReg = new RegExp(`(extends\\s+${className}).*{\\s*\n`, 'g');

        // console.log(fileContent.match(extendsReg));
        // Remove the extends clause for the class
        fileContent = fileContent.replace(extendsReg, '{\n');
      });
      // Remove the import statement for the class, including its aliases
      const importReg = new RegExp(`import\\s+{\\s*${classNames.join('\\s*,\\s*')}\\s*} from ['"]@nestjs\/.*['"]\\s*;?`, 'g');
      fileContent = fileContent.replace(importReg, '');
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
