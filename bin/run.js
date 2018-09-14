#!/usr/bin/env node
// Above line is required for npm to make a symlink to this file to run in the command line
// See https://docs.npmjs.com/files/package.json#bin for details
/*************************************************************************
 * Requires and Variables
 *************************************************************************/
const inquirer = require('inquirer');
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
const prompts = require('prompts.js');
/*************************************************************************
 * Executes and manages cli data
 *************************************************************************/
var cli = async () => {
    await inquirer.prompt(prompts).then();
    await inquirer.prompt(prompts).then();
};

cli();