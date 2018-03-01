var buildCourses = require('./teacherCoursesAndEnrollments.js');

buildCourses()
    .then(courses => {
        console.log('Complete');
    });