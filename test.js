var buildCourses = require('./buildCourses.js');
var addStudentData = require('./studentFunctions.js');

buildCourses()
    .then(addStudentData)
    .then(courseDataObjects => {
        console.log('Complete');
    });

// addStudentData();