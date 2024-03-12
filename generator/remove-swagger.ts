const path = require('path');
const fs = require('fs');

const sourceFolderPath = '/your/source/folder/path'; // 替換成你的原始資料夾路徑
const dtoFolderPath = path.join(sourceFolderPath, '../dto'); // 將修改過的檔案儲存到上一層的 ./dto 資料夾內

function removeApiProperty(filePath: string) {
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  // 移除 import { ApiProperty } from '@nestjs/swagger';
  fileContent = fileContent.replace("import { ApiProperty } from '@nestjs/swagger';", '');

  // 移除 @ApiProperty decorators
  fileContent = fileContent.replace(/@ApiProperty\(.*?\)\s*/g, '');

  fs.writeFileSync(filePath, fileContent);
}

function processFiles(folderPath: string) {
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processFiles(filePath);
    } else if (filePath.endsWith('.dto.ts')) {
      const modifiedContent = removeApiProperty(filePath);
      const fileName = path.basename(filePath);
      const newFilePath = path.join(dtoFolderPath, fileName);
      fs.writeFileSync(newFilePath, modifiedContent);
    }
  });
}

// 如果 ./dto 資料夾不存在，則創建它
if (!fs.existsSync(dtoFolderPath)) {
  fs.mkdirSync(dtoFolderPath);
}