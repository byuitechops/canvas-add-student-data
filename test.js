var buildCourses = require('./buildCourses.js');
var addStudentData = require('./studentFunctions.js');

buildCourses()
    // .then(addStudentData)
    .catch(console.log);

// addStudentData()
//     .catch(console.log);