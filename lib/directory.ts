import fs from 'fs';
import path from 'path';

/**
 * 讀取資料夾下所有檔案路徑
 * 
 * @param directoryPath 
 * @param parentDirectory 
 * @returns 所有檔案路徑 array
 */
export function readDirectory(directoryPath: string, parentDirectory = ''): string[] {
  // 讀取目錄下的所有檔案和子資料夾
  const files = fs.readdirSync(directoryPath);

  // 儲存檔案路徑
  const filePaths: any[] = [];

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
