#!/usr/bin/env node

const program = require('commander');
const {
  writeFile,
  readDirectory,
  generateExportStatements,
} = require('./generator');

program
  .version('1.0.0')
  .description('CLI for generate index.ts export statements')
  .option('-d, --directory <path>', '指定要讀取的目錄路徑')
  .parse(process.argv);

// 讀取目錄
const filePaths = readDirectory(program.directory);

// 生成 export 語句
const exportStatements = generateExportStatements(filePaths);

console.log(exportStatements);

writeFile(filePaths);
