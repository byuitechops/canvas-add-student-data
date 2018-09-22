const path = require('path');
const buildCourses = require( path.join(__dirname, './buildCourses.js') );
const studentFunctions = require( path.join(__dirname, './studentFunctions.js') );
const syncCourses = require( path.join(__dirname, './syncCourses.js') );
const deleteCourse = require( path.join(__dirname, './deleteFailedCourses.js') );

module.exports = async (jsonFilePath, sandboxSubAccountNumber, masterCourseNumber, syncingComment) => {
    // NOTE The commented code could potentially be valid if those scripts were finished
    var nextFileToRun;
    await buildCourses(jsonFilePath, sandboxSubAccountNumber, masterCourseNumber, syncingComment)
        .then((nextFilePath) => {nextFileToRun = nextFilePath})
        // .catch( deleteCourse() );
    // await syncCourses(null)
    //     .catch( deleteCourse() );
    await studentFunctions(nextFileToRun)
        // .catch( deleteCourse() );
};