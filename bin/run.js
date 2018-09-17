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
var setupPrompt = [
    prompts.chooseStep,
];

var step1 = [
    prompts.selectFile(['.csv']) // Returns custom 'selectFile' question object that only lists files with the given extension
];
var step2 = [
    prompts.selectFile(['.json']), // Returns custom 'selectFile' question object that only lists files with the given extension
    prompts.setSandboxNumber,
    prompts.setMasterCourse,
    prompts.masterCourseOther,
    prompts.syncingComment
];
var step3 = [
    prompts.selectFile(['.json']) // Returns custom 'selectFile' question object that only lists files with the given extension
];
var step = {
    step1: step1, 
    step2: step2, 
    step3: step3
};

var endPrompt = [
    prompts.runAgain
]

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
    await inquirer.prompt(setupPrompt);
    await inquirer.prompt(step[step2]);
    await inquirer.prompt(endPrompt)
};

cli();