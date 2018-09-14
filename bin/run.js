#!/usr/bin/env node
// Above line is required for npm to make a symlink to this file to run in the command line
// See https://docs.npmjs.com/files/package.json#bin for details
/*************************************************************************
 * Requires and Variables
 *************************************************************************/
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
var runningDir = path.resolve('./');
var targetFile = path.join(__dirname, '/prompts.json');
var promptsFile = fs.readFileSync(targetFile);
var promptsJSON = JSON.parse(promptsFile);
// console.log(promptsJSON);
// console.log(targetFile);

/*************************************************************************
 * @param {array} extension 
 * Takes an array of extenstions (include the dot).
 * Then filters the files in the running directory by extension
 *************************************************************************/
var filterByFileType = (extension) => {
    var filesInDir = fs.readdirSync(runningDir, 'utf8');
    var filteredFiles = filesInDir.reduce((acc, file) => {
        if ( extension.some( (ext) => path.extname(file) === ext ) ) {
            acc.push(file);
        }
        return acc;
    }, []);
    return filteredFiles
};

/*************************************************************************
 * @param {string} promptKey takes a string key of what prompt to change
 * @param {array} choices takes an array of choices to sort through
 * @param {function} filterFunction signature: (input, choice), returns bool
 * 
 *************************************************************************/
var cbpSetSourceAttrib = (promptKey, choices, filterFunction) => {
    promptsJSON[promptKey].source = (answersSoFar, input) => {
        var filteredChoices = choices.reduce((acc, choice) => {
            if (filterFunction(input, choice)) acc.push(choice);
            return acc;
        }, []);
        return Promise.resolve(filteredChoices);
    }
}

/*************************************************************************
 * @param {array} extension 
 * Takes an array of extenstions (include the dot).
 * Then filters the files in the running directory by extension
 *************************************************************************/
/*************************************************************************
 * updates the parameters that take functions with the functions with 
 * corresponding names
 *************************************************************************/
var updatePromptsJSON = () => {
    console.log('updating JSONs prompts');
    var promptsArr = Object.keys(promptsJSON).forEach( (prompt) => {
        if ( promptsJSON[prompt].type === 'checkbox-plus' ) {
            promptsJSON[prompt].highlight = true;
            promptsJSON[prompt].searchable = true;
            promptsJSON[prompt].source = (answersSoFar, input) => cbpSourceFn(answersSoFar, input, ['Error: No Choices Specified']);
        }
    } );
};


/*************************************************************************
 * Executes and manages cli data
 *************************************************************************/
var cli = async () => {
    updatePromptsJSON();
    var answers = {};
    await inquirer.prompt(promptsJSON.normalInput).then();
    cbpSetSourceAttrib('checkboxplusTest', filterByFileType(['.js']), (input, choice) => choice.includes(input));
    await inquirer.prompt(promptsJSON.checkboxplusTest).then();

};

cli();