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
    const fileNames = filePaths.map((file) => file.replace('.ts', '').replace(/\\/g, '/'));
    const exportStatements = generateExportStatements(fileNames);
    const content = `${exportStatements}\n`;

    // Check if a file with the same name and content already exists
    const existingFilePath = `${outputPath}/index.ts`;
    if (fs.existsSync(existingFilePath)) {
      const existingContent = fs.readFileSync(existingFilePath, 'utf-8');
      if (existingContent === content) {
        console.log(chalk.yellowBright('index.ts'), chalk.blue('already exists and has the same content, no need to write again.'));
        return; // If a file with the same content already exists, don't perform the write operation
      }
    }

    // Write a new file
    fs.writeFileSync(existingFilePath, content);

    // Create a new file "devops-trigger.txt" if it doesn't exist
    const devopsTriggerFilePath = `${outputPath}/../devops-trigger.txt`;
    if (!fs.existsSync(devopsTriggerFilePath)) {
      fs.writeFileSync(devopsTriggerFilePath, '');
      console.log(chalk.yellowBright('devops-trigger.txt'), chalk.blue('file has been created successfully!'));
    } else {
      function getRandomEmoji(): string {
        const emojis = ['😀', '😎', '🚀', '🌟', '🎉'];
        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex];
      }

      // Write a random emoji into the trigger txt
      fs.appendFileSync(devopsTriggerFilePath, getRandomEmoji());
    }

    console.log(chalk.yellowBright('index.ts'), chalk.blue('file has been generated successfully!'));
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

// console.log('Generating...');

// // 呼叫函式讀取目錄
// const filePaths = readDirectory(directoryPath);

// writeFile(filePaths);

export { writeDtoToFile, generateExportStatements };
