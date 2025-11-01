#!/usr/bin/env node

/**
 * Games Base CLI
 * Command-line tool for creating game projects with games-base engine
 */

const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');

// Import commands
const createCommand = require('../dist/commands/create');
const buildCharacterCommand = require('../dist/commands/buildCharacter');

program
  .name('games-base')
  .description('CLI tool for creating game projects with games-base engine')
  .version('1.0.0');

// Create command
program
  .command('create <project-name>')
  .description('Create a new game project')
  .option('-t, --template <template>', 'Project template (basic, platformer, topdown)', 'basic')
  .option('--no-install', 'Skip dependency installation')
  .action(createCommand);

// Build character command
program
  .command('build-character')
  .description('Build a character with sprite and animations')
  .option('-n, --name <name>', 'Character name', 'Character')
  .option('-s, --sprite <path>', 'Path or URL to character sprite')
  .option('--walk <path>', 'Path or URL to walk animation')
  .option('--run <path>', 'Path or URL to run animation')
  .option('--attack <path>', 'Path or URL to attack animation')
  .option('--injured <path>', 'Path or URL to injured animation')
  .option('--dead <path>', 'Path or URL to dead animation')
  .option('-o, --output <path>', 'Output directory', './characters')
  .action(buildCharacterCommand);

program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
