#!/usr/bin/env node
// Above line is required for npm to make a symlink to this file to run in the command line
// See https://docs.npmjs.com/files/package.json#bin for details
const path = require('path');
const runCLI = require(path.join(__dirname, 'runCLI.js'));
// TODO Refactor these includes to make sure they have modules.export and a correct corresponding signature
const idInstructors = require(path.join(__dirname, '/../identifyInstructorsFromCSV.js'));
const buildCourse = require(path.join(__dirname, '/../buildCourses.js'));
const studentFuctions = require(path.join(__dirname, '/../studentFunctions.js'));
const enrollTeachers = require(path.join(__dirname, '/../enrollTeachers.js'));

var runIdInstructors = (csvLocation) => {
    idInstructors(csvLocation);
};

var runBuildCourse = async (jsonLocation, sandboxNumber, masterCourse, comment) => {
    var newJson = await buildCourse(jbuildCourse(jsonLocation, sandboxNumber, masterCourse, comment);
    // TODO Make the output of buildCourse be the location of the file that studentFunctions needs
    studentFuctions(newJson);
};

var runEnrollTeachers = (jsonLocation) => {
    enrollTeachers(jsonLocation);
};

var getStep = (userInput) => {
    var steps = {
        [userInput.steps.step1]: () => runIdInstructors,
        [userInput.steps.step2]: () => runBuildCourse,
        [userInput.steps.step3]: () => runEnrollTeachers
    }
    return steps[userInput.chooseStep]
}

var runStep = (step, userInput) => {
    step (userInput.selectFile, userInput.setSandboxNumber, userInput.setMasterCourse, userInput.syncingComment);
};

(async function () {
console.log('Please wait...');
var userInput = await runCLI();
console.log(userInput);
runStep( getStep(userInput) );
console.log('finished!');
})();
