console.log('Please wait...');
/*************************************************************************
 * Requires and Variables
 *************************************************************************/
const fs = require('fs');
const path = require('path');
var runningDir = path.resolve('./');

/*************************************************************************
 * @param {array} extension 
 * Takes an array of extenstions (include the dot).
 * Then filters the files in the running directory by extension
 *************************************************************************/
var filterByFileType = (extension) => {
    var filesInDir = fs.readdirSync(runningDir, 'utf8');
    var filteredFiles = filesInDir.reduce((acc, file) => {
        if (extension.some((ext) => path.extname(file) === ext)) {
            acc.push(file);
        }
        return acc;
    }, []);
    return filteredFiles;
};

/*************************************************************************
 * @param {string} promptKey takes a string key of what prompt to change
 * @param {array} choices takes an array of choices to sort through
 * @param {function} filterFunction signature: (input, choice), returns bool
 *************************************************************************/
var cbpSetSourceAttrib = (promptKey, choices, filterFunction) => {
    promptsJSON[promptKey].source = (answersSoFar, input) => {
        var filteredChoices = choices.reduce((acc, choice) => {
            if (filterFunction(input, choice)) acc.push(choice);
            return acc;
        }, []);
        return Promise.resolve(filteredChoices);
    };
};

var cbpSourceFn = (answersSoFar, input, choices) => {
    var filteredChoices = choices.reduce((acc, choice) => {
        if (choice.includes(input)) acc.push(choice);
        return acc;
    }, []);
    return Promise.resolve(filteredChoices);
};

/*************************************************************************
 * updates the parameters that take functions with the functions with 
 * corresponding names
 *************************************************************************/
var updatePromptsJSON = () => {
    var promptsArr = Object.keys(promptsJSON).forEach((prompt) => {
        if (promptsJSON[prompt].type === 'checkbox-plus') {
            promptsJSON[prompt].highlight = true;
            promptsJSON[prompt].searchable = true;
            promptsJSON[prompt].source = (answersSoFar, input) => cbpSourceFn(answersSoFar, input, ['Error: No Choices Specified']);
        }
    });
};

var questions = {
    selectFile: {
        type: "checkbox-plus",
        name: "selectFile",
        message: "Select a file:",
        highlight: true,
        searchable: true,
        source: (answersSoFar, input) => cbpSourceFn(answersSoFar, input, )
    },
    setSandboxNumber: {
        type: "number",
        name: "setSandboxNumber",
        message: "Enter the target sandbox's sub-account number (default: 8):",
        default: 8
    },
    setMasterCourse: {
        type: "list",
        name: "setMasterCourse",
        message: "Select a Template:",
        choices: [
            "Online",
            "Campus",
            "Other"
        ],
        filter: "setMasterCourseNumber"
    },
    theOtherPrompt: {
        type: "input",
        name: "theOtherPrompt",
        message: "other:"
    },
    syncingComment: {
        type: "input",
        name: "syncingComment",
        message: "Enter a syncing comment for canvas:"
    }
};

module.exports = questions;