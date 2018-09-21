#!/usr/bin/env node
// Above line is required for npm to make a symlink to this file to run in the command line
// See https://docs.npmjs.com/files/package.json#bin for details
/*************************************************************************
 * Requires and Variables
 *************************************************************************/
const path = require('path');
const inquirer = require('inquirer');
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
const prompts = require(path.join(__dirname, 'prompts.js')); // Object with all inquirer prompts and logic

/*************************************************************************
 * Executes and manages cli data
 *************************************************************************/
var cli = async () => {
    var stepKey = (await inquirer.prompt(prompts.setup)).chooseStep;
    var userInput = await inquirer.prompt(prompts[stepKey]);
    userInput.chooseStep = stepKey; // Append first answer to set of second
    userInput.steps = prompts.steps; // Pass this along to next function so it knows which function to run from the answer given on the choose step function
    return answers;
};

module.exports = cli;