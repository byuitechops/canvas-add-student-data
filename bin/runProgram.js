#!/usr/bin/env node
// Above line is required for npm to make a symlink to this file to run in the command line
// See https://docs.npmjs.com/files/package.json#bin for details
const path = require('path');
const runCLI = require(path.join(__dirname, '/../brickCLI/runCLI.js'));
const idInstructors = require(path.join(__dirname, '/../brickIdentifyInstructors/identifyInstructorsFromCSV.js'));
const buildCourse = require(path.join(__dirname, '/../brickBuildCourseFromBlueprint/buildCourseController.js'));
const enrollTeachers = require(path.join(__dirname, '/../brickEnrollTeachers/enrollTeachers.js'));

// const idInstructors = (file) => {console.log(file)}
// const buildCourse = (file) => {console.log(file)}
// const enrollTeachers = (file) => {console.log(file)}

var getStep = (userInput) => {
    var steps = {
        [userInput.steps.step1]: idInstructors,
        [userInput.steps.step2]: buildCourse,
        [userInput.steps.step3]: enrollTeachers
    }
    delete userInput.steps;
    return steps[userInput.chooseStep]
}

var runStep = (step, userInput) => {
    // userInput.selectFile is passed in as an array. This will allow for future support of running multiple files at once
    step (userInput.selectFile[0], userInput.setSandboxNumber, userInput.setMasterCourse, userInput.syncingComment);
};

(async function () {
console.log('Please wait...');
var userInput = await runCLI();
runStep( getStep(userInput), userInput );
console.log(userInput);
console.log('finished!');
})();

