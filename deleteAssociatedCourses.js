const canvas = require('canvas-wrapper');
const asyncLib = require('async');
const courses = require('./fix4.json');
const masterCourse = 4272;


function deleteCourses(courses) {
    console.log("delete");
    asyncLib.eachLimit(courses, 10, (course, cb) => {
        canvas.delete(`/api/v1/courses/${course.id}?event=delete`, (err) => {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }
            console.log(`Course Deleted: ${course.name} with id:${course.id}`);
            cb();
        });
    });
}

// canvas.get(`/api/v1/courses/${masterCourse}/blueprint_templates/default/associated_courses`, (err, courses) => {
//     deleteCourses(courses);
// });

var byeBye = courses
    .map((course) => {
        return {
            id: course.course.id,
            name: course.teacher.name
        };
    });
    
console.log(byeBye);
deleteCourses(byeBye);
