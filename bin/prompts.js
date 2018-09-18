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
var filterByFileType = (extensions) => {
    var filesInDir = fs.readdirSync(runningDir, 'utf8');
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
 * WHEN
 * @param {Object} answersSoFar comes from inquirer
 * @param {array} acceptableSteps array of values to compare vs answer from chooseStep question.
 *************************************************************************/
// when: (answersSoFar) => stepIsChosen(answersSoFar, [steps.step1, steps.step2, steps.step3])
var stepIsChosen = (answersSoFar, acceptableSteps) => {
    return acceptableSteps.some((step) => answersSoFar.chooseStep === step);
};

/*************************************************************************
 * VALIDATE
 * Returns true if the value is a number. No coercing will occur 
 *************************************************************************/
// TODO Make sure " " (space) doesn't registar as 0 (or a number)
var isNumber = (valueToCheck) => {
    if (valueToCheck === '' || isNaN(valueToCheck)) {
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
// TODO Find out why this is returning undefined
var setMasterCourseNumber = (answersSoFar) => {
    var courseOptions = {
        ["Online"]: 4272,
        ["Campus"]: 4274,
        ["Other"] : -1
    };
    return courseOptions[answersSoFar.setMasterCourse];
};

/*************************************************************************
 * prompts object and vars for prompts object
 *************************************************************************/
var steps = {
    step1: "1) Identify Instructors From CSV",
    step2: "2) Build Course/Student Functions",
    step3: "3) Enroll Teacher"
};

var prompts = {
    chooseStep: {
        type: "list",
        name: "chooseStep",
        message: "Select which step you'd like to run:",
        choices: [
            steps.step1,
            steps.step2,
            steps.step3
        ]
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
        choices: [
            "Online",
            "Campus",
            "Other"
        ],
        filter: setMasterCourseNumber,
        validate: isNumber
    },
    masterCourseOther: {
        type: "input",
        name: "theOtherPrompt",
        message: "Enter an alternate master course number:",
        // TODO Write 'when:' function
        // when: null, // setMasterCourse answer === Other
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
    step1: [
        prompts.selectFile(['.csv']) // Returns custom 'selectFile' question object that only lists files with the given extension
    ],
    step2: [
        prompts.selectFile(['.json']), // Returns custom 'selectFile' question object that only lists files with the given extension
        prompts.setSandboxNumber,
        prompts.setMasterCourse,
        prompts.masterCourseOther,
        prompts.syncingComment
    ],
    step3: [
        prompts.selectFile(['.json']) // Returns custom 'selectFile' question object that only lists files with the given extension
    ],
    close: [
        prompts.runAgain
    ]
};