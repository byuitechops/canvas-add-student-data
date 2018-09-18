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

var appendAnswersObject = (objectToAppend, answersFromBatch) => {
    if (typeof objectToAppend !== 'object') return answersFromBatch;
    return Object.keys(answersFromBatch).reduce((acc, answerKey) => {
        acc[answerKey] = answersFromBatch[answerKey];
        return acc;
    }, objectToAppend);
}

/*************************************************************************
 * Executes and manages cli data
 *************************************************************************/
var cli = async () => {
    var allAnswers = {};
    var stepKey = 'step2';
    await inquirer.prompt(prompts.setup);
    await inquirer.prompt(prompts[stepKey])
        .then( console.log )
        .then(/*Run Corresponding step*/)
        .catch(/*Append Error Log*/)
        // .finally(/*Write Error Log*/);
    console.log('finished!')
};

cli();