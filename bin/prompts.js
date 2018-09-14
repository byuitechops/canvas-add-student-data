console.log('Please wait...');
/*************************************************************************
 * Requires and Variables
 *************************************************************************/
const fs = require('fs');
const path = require('path');
var runningDir = path.resolve('./');
var extensions = [];

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
    filteredFiles.sort((a, b) => {
        // The larger number is later in the future
        var aTime = fs.Stats(path.join(runningDir, a)).mtimeMs;
        var bTime = fs.Stats(path.join(runningDir, b)).mtimeMs;
        // This will put the larger number at the beginning
        return bTime - aTime;
    });
    return filteredFiles;
};

/*************************************************************************
 * This is used in assigning the source attribute for checkbox-plus
 * Use like so:
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
 * Requires and Variables
 *************************************************************************/
// TODO finish this function: Find a way to get the answersSoFar into this function. This signature may or may not work
var stepIsChosen = (answersSoFar, acceptableSteps) => {
    if (acceptableSteps.some(answersSoFar.chooseStep)) {
        return true;
    }
    return false;
};


/*************************************************************************
 * prompts object and vars for prompts object
 *************************************************************************/
var steps = {
    step1: "Identify Instructors From CSV",
    step2: "Build Course/Student Functions",
    step3: "Enroll Teacher"
};

var number = {
    [steps.step1]: 1,
    [steps.step2]: 2,
    [steps.step3]: 3
};

var prompts = {
    chooseStep: {
        type: "rawlist",
        name: "chooseStep",
        message: "Select which step you'd like to run:",
        choices: [
            steps.step1,
            steps.step2,
            steps.step3
        ],
        filter: (answersSoFar) => {
            return number[answersSoFar.chooseStep];
        },
    },
    selectFile: {
        type: "checkbox-plus",
        name: "selectFile",
        message: "Select a file:",
        highlight: true,
        searchable: true,
        source: (answersSoFar, input) => cbpSourceFn(answersSoFar, input, filterByFileType(extensions)),
        when: (answersSoFar) => stepIsChosen(answersSoFar, [1,2,3]) // Find out if this works by testing
    },
    setSandboxNumber: {
        type: "number",
        name: "setSandboxNumber",
        message: "Enter the target sandbox's sub-account number (default: 8):",
        default: 8,
        when: stepIsChosen([2])
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
        filter: "setMasterCourseNumber",
        when: stepIsChosen([2])
    },
    theOtherPrompt: {
        type: "input",
        name: "theOtherPrompt",
        message: "other:",
        when: stepIsChosen([2])
    },
    syncingComment: {
        type: "input",
        name: "syncingComment",
        message: "Enter a syncing comment for canvas:",
        when: stepIsChosen([2])
    },
    runAgain: {
        type: "confirm",
        name: "runAgain",
        message: "Would you like to run the program again?"
    }
};

module.exports = prompts;