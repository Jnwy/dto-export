import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

// const searchPath = path.join(__dirname, 'src/game/dto/');
// const directoryPath = path.join(__dirname, 'src/dto');
// const outputPath = path.join(__dirname, 'src/dto/index.ts');

// console.log(directoryPath, outputPath);
/**
 * 由 filePaths 產生 "export * from {filePath} ;" 的匯出區塊 string
 * 
 * @param filePaths 
 * @returns 
 */
function generateExportStatements(filePaths: string[]): string {
  return filePaths
    .map(
      (filePath) =>
        `export * from './${filePath.replace('\\', '/').replace('.ts', '')}';`
    )
    .join('\n');
}



/**
 * 產生一個 export 所有 filePaths 的 index.ts
 * 
 * @param filePaths dto files path array
 * @param outputPath path to generates index.ts file which export dtos
 */
async function writeDtoToFile(filePaths: string[], outputPath: string) {
  try {
    const fileNames = filePaths.map((file) => file.replace('.ts', ''));
    const exportStatements = generateExportStatements(fileNames);
    const content = `${exportStatements}\n`;
    try {
      fs.writeFileSync(`${outputPath}/index.ts`, content);
    } catch (error) {
      console.error('Error writing file:', error);
    } finally {
      console.log(chalk.yellowBright('index.ts'), chalk.blue('file has been generated successfully!'));
    }
  } catch (err) {
    console.error('Error reading files:', err);
  }

}


// console.log('Generating...');

// // 呼叫函式讀取目錄
// const filePaths = readDirectory(directoryPath);

// writeFile(filePaths);

export { writeDtoToFile, generateExportStatements };
