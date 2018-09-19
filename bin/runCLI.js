#!/usr/bin/env node
// Above line is required for npm to make a symlink to this file to run in the command line
// See https://docs.npmjs.com/files/package.json#bin for details
/*************************************************************************
 * Requires and Variables
 *************************************************************************/
const path = require('path');
const inquirer = require('inquirer');
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
const runProgram = require(path.join(__dirname, 'runProgram.js'))
const prompts = require(path.join(__dirname, 'prompts.js')); // Object with all inquirer prompts and logic

/*************************************************************************
 * Executes and manages cli data
 *************************************************************************/
var cli = async () => {
    var stepKey = (await inquirer.prompt(prompts.setup)).chooseStep;
    await inquirer.prompt(prompts[stepKey])
        .then(runProgram)
        .catch(/*Append Error Log*/)
    console.log('finished!')
};

cli();