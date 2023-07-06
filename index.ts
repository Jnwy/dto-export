#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import prompts from 'prompts';

const {
  writeFile,
  readDirectory,
  generateExportStatements,
} = require('./generator');

let devPath: string = '';

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

const onPromptState = (state: any) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write('\x1B[?25h');
    process.stdout.write('\n');
    process.exit(1);
  }
};

const program = new Command()
  .version('1.0.0')
  .description('CLI for generate index.ts export statements')
  // .action((p) => {
  //   devPath = p;
  // })
  // .option('-d, --directory <string>', '指定要讀取的目錄路徑')
  .parse(process.argv);


async function run(): Promise<void> {

  const options = program.opts();

  // console.log(port);

  if (typeof devPath === 'string') {
    devPath = devPath.trim();
  }

  if (!devPath) {
    const res = await prompts({
      onState: onPromptState,
      type: 'text',
      name: 'path',
      message: 'What is the path to your DTO directory?',
      initial: 'C:\\repos\\tools\\dto-export\\testSrc\\dto',
    });

    if (typeof res.path === 'string') {
      devPath = res.path.trim();
    }
  }

  if (!devPath) {
    console.log(
      '\nPlease specify the project directory:\n' +
      `  ${chalk.cyan(program.name())} ${chalk.green(
        '<project-directory>'
      )}\n` +
      'For example:\n' +
      `  ${chalk.cyan(program.name())} ${chalk.green('./src')}\n\n` +
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }



  // 讀取目錄
  const filePaths = readDirectory(devPath);

  // 生成 export 語句
  const exportStatements = generateExportStatements(filePaths);

  console.log(exportStatements);

  writeFile(filePaths, devPath);
}

run();