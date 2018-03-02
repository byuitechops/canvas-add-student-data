var buildCourses = require('./buildCourses.js');
var addStudentData = require('./studentFunctions.js');

buildCourses()
    .then(addStudentData);

// addStudentData();