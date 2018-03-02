var buildCourses = require('./buildCourses.js');
var addStudentData = require('./studentFunctions.js');
var meep = require('./submitQuiz.js');

buildCourses()
    .then(addStudentData)
    .catch(console.log);

// addStudentData();