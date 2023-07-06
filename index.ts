#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import prompts from 'prompts';
import chokidar from 'chokidar';

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
  .description('CLI for generating index.ts export statements')
  .option('-d, --path <path>', 'Specify the directory path to read')
  .option('-w, --watch', 'Watch for file changes')
  .parse(process.argv);

async function run(): Promise<void> {
  const options = program.opts();

  if (typeof options.path === 'string') {
    devPath = options.path.trim();
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
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}\n` +
        'For example:\n' +
        `  ${chalk.cyan(program.name())} ${chalk.green('./src')}\n\n` +
        `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  if (options.watch) {
    const watcher = chokidar.watch(devPath);

    watcher.on('change', (filePath) => {
      console.log(`File changed: ${filePath}`);

      // Read directory
      const filePaths = readDirectory(devPath);

      // Generate export statements
      const exportStatements = generateExportStatements(filePaths);

      console.log(exportStatements);

      writeFile(filePaths, devPath);
    });

    console.log(`Watching for changes in directory: ${devPath}`);
  } else {
    // Read directory
    const filePaths = readDirectory(devPath);

    writeFile(filePaths, devPath);
  }
}

run();
