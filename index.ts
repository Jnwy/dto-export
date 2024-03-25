#!/usr/bin/env node;
import chalk from 'chalk';
import chokidar from 'chokidar';
import { Command } from 'commander';
import prompts from 'prompts';
import { genTableRun } from './generator/tableConfig.generator';

import { writeDtoToFile } from './generator/export.generator';
import { generateMapper } from './mapper';
import { readDirectory } from './lib/directory';

import fs from 'fs-extra';
import path from 'path';
import { processRemoveSwagger } from './generator/remove-swagger';
import { processDto } from './generator/dto';

let serverDtoPath: string = '';

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
  .command('dto').action(() => {
    console.log(`execute: dto`);
    runDtoGenerator();
  }).option('-d, --path <path>', 'Specify the directory path to read')
  .option('-w, --watch', 'Watch for file changes');

program.command('mapper').alias('m').action(() => {
  generateMapper();
});

program
  .command('table')
  .description('Generate tableConfig by ListResult interface.')
  .action((options) => {
    // console.log('Generate Table Schema');
    // console.log('Command table executed with options:');
    console.log(options);
    genTableRun();
  });

program.parse(process.argv);
async function runDtoGenerator(): Promise<void> {
  const options = program.opts();

  if (typeof options.path === 'string') {
    serverDtoPath = options.path.trim();
  }

  if (!serverDtoPath) {
    const res = await prompts({
      onState: onPromptState,
      type: 'text',
      name: 'path',
      message: 'What is the path to your DTO directory?',
      initial: 'C:\\repos\\tools\\dto-export\\testSrc\\server-dto',
    });

    if (typeof res.path === 'string') {
      serverDtoPath = res.path.trim();
    }
  }

  if (!serverDtoPath) {
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
    const watcher = chokidar.watch(serverDtoPath);

    watcher.on('change', (filePath) => {
      console.log(`File changed: ${filePath}`);
      processDto(serverDtoPath);
    });

    console.log(`Watching for changes in directory: ${serverDtoPath}`);
  } else {
    processDto(serverDtoPath);
  }
}


// const templatePath = path.join(__dirname, 'template');
// const tableConfigTemplate = fs.readFileSync(templatePath, 'utf-8');
// console.log(tableConfigTemplate);