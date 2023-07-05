const path = require('path');
const fs = require('fs');

// const searchPath = path.join(__dirname, 'src/game/dto/');
const directoryPath = path.join(__dirname, 'src/dto');
const outputPath = path.join(__dirname, 'src/dto/index.ts');

console.log(directoryPath, outputPath);

function generateExportStatements(filePaths) {
  return filePaths
    .map(
      (filePath) =>
        `export * from './${filePath.replace('\\', '/').replace('.ts', '')}';`
    )
    .join('\n');
}

function readDirectory(directoryPath, parentDirectory = '') {
  // 讀取目錄下的所有檔案和子資料夾
  const files = fs.readdirSync(directoryPath);

  // 儲存檔案路徑
  const filePaths = [];

  // 遍歷檔案和資料夾
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    if (file === 'index.ts') return;

    // 檢查檔案的類型
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // 如果是子資料夾，則遞迴讀取該子資料夾
      const currentDirectory = path.join(parentDirectory, file);
      const subDirectoryFiles = readDirectory(filePath, currentDirectory);
      filePaths.push(...subDirectoryFiles);
    } else if (file.endsWith('.ts')) {
      // 如果是以 .ts 結尾的檔案，則將檔案路徑存入陣列
      const currentFilePath = path.join(parentDirectory, file);
      filePaths.push(currentFilePath);
    }
  });

  return filePaths;
}

function writeFile(files) {
  (async () => {
    try {
      const fileNames = files.map((file) => file.replace('.ts', ''));
      const exportStatements = generateExportStatements(fileNames);
      const content = `${exportStatements}\n`;

      fs.writeFile(outputPath, content, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('index.ts file has been generated successfully!');
        }
      });
    } catch (err) {
      console.error('Error reading files:', err);
    }
  })();
}

console.log('Generating...');

// 呼叫函式讀取目錄
const filePaths = readDirectory(directoryPath);

writeFile(filePaths);
