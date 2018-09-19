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
var filesInDir = fs.readdirSync(runningDir, 'utf8');
var filterByFileType = (extensions) => {
    var filteredFiles = filesInDir.reduce((acc, file) => {
        if (extensions.some((ext) => path.extname(file) === ext)) {
            acc.push(file);
        }
        return acc;
    }, []);
    filteredFiles.sort((a, b) => {
        // The larger number is later in the future
        var aTime = fs.statSync(path.join(runningDir, a)).mtimeMs;
        var bTime = fs.statSync(path.join(runningDir, b)).mtimeMs;
        // This will put the larger number at the beginning
        return bTime - aTime;
    });
    return filteredFiles;
};

var objectToArray = (object) => {
    return Object.keys(object).map( (key) => object[key]);
};

/*************************************************************************
 * SOURCE
 * (answersSoFar, input) => cbpSourceFn(answersSoFar, input, ['array']);
 * @param {Object} answersSoFar
 * @param {string} input
 * @param {array} choices
 *************************************************************************/
var cbpSourceFn = (answersSoFar, input, choices) => {
    var filteredChoices = choices.reduce((acc, choice) => {
        if (choice.includes(input)) acc.push(choice);
        return acc;
    }, []);
    return Promise.resolve(filteredChoices);
};

/*************************************************************************
 * VALIDATE
 * Returns true if the value is a number. No coercing will occur 
 *************************************************************************/
var isNumber = (valueToCheck) => {
    // if parseInt isnt here, values such as blank and space will be accepted
    if (isNaN( parseInt(valueToCheck) )) {
        console.log('\nYour input must be a number!');
        return false;
    }
    return true;
};

/*************************************************************************
 * VALIDATE
 * Returns true if the value is not blank / length property !== 0 
 *************************************************************************/
var isNotBlank = (valueToCheck) => {
    if (valueToCheck.length === 0) {
        console.log('\nYou cannot leave this field blank!');
        return false;
    }
    return true;
};

/*************************************************************************
 * FILTER
 * Returns the course number corresponding with online and campus positions
 *************************************************************************/
var setMasterCourseNumber = (userInput) => {
    var courseOptions = {
        [masterCourseOptions.online]: 4272,
        [masterCourseOptions.campus]: 4274,
        [masterCourseOptions.other] : -1 // Make sure other is less than 0
    };
    return courseOptions[userInput];
};

/*************************************************************************
 * prompts object and vars for prompts object
 *************************************************************************/
var steps = {
    step1: "1) Identify Instructors From CSV",
    step2: "2) Build Course/Student Functions",
    step3: "3) Enroll Teacher"
};

var masterCourseOptions = {
    online: "Online",
    campus: "Campus",
    other : "Other"
};

var prompts = {
    chooseStep: {
        type: "list",
        name: "chooseStep",
        message: "Select which step you'd like to run:",
        choices: objectToArray(steps),
    },
    selectFile: (extensions) => {
        return {
            type: "checkbox-plus",
            name: "selectFile",
            message: "Select a file:",
            highlight: true,
            searchable: true,
            source: (answersSoFar, input) => cbpSourceFn(answersSoFar, input, filterByFileType(extensions)),
            validate: isNotBlank
        };
    },
    setSandboxNumber: {
        type: "input",
        name: "setSandboxNumber",
        message: "Enter the target sandbox's sub-account number (default: 8):",
        default: 8,
        validate: isNumber
    },
    setMasterCourse: {
        type: "list",
        name: "setMasterCourse",
        message: "Select a Template:",
        choices: objectToArray(masterCourseOptions),
        filter: setMasterCourseNumber,
        validate: isNumber
    },
    masterCourseOther: {
        type: "input",
        name: "masterCourseOther",
        message: "Enter an alternate master course number:",
        when: (answersSoFar) => answersSoFar.setMasterCourse < 0,
        validate: isNumber
    },
    syncingComment: {
        type: "input",
        name: "syncingComment",
        message: "Enter a syncing comment for canvas:",
        validate: isNotBlank
    },
    runAgain: {
        type: "confirm",
        name: "runAgain",
        message: "Would you like to run the program again?",
        default: false
    }
};

module.exports = {
    setup: [
        prompts.chooseStep
    ],
    [steps.step1]: [
        prompts.selectFile(['.csv']) // Returns custom 'selectFile' question object that only lists files with the given extension
    ],
    [steps.step2]: [
        prompts.selectFile(['.json']), // Returns custom 'selectFile' question object that only lists files with the given extension
        prompts.setSandboxNumber,
        prompts.setMasterCourse,
        prompts.masterCourseOther,
        prompts.syncingComment
    ],
    [steps.step3]: [
        prompts.selectFile(['.json']) // Returns custom 'selectFile' question object that only lists files with the given extension
    ],
    close: [
        prompts.runAgain
    ]
};