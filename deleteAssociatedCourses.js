const canvas = require('canvas-wrapper');
const asyncLib = require('async');
const masterCourse = 4272;

function deleteCourses(courses) {
    asyncLib.eachLimit(courses, 10, (courcourse, cb) => {
        canvas.delete(`/api/v1/courses/${courcourse.id}?event=delete`, (err) => {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }
            console.log(`Course Deleted: ${courcourse.name} with id:${courcourse.id}`);
            cb();
        });
    });
}

// canvas.get(`/api/v1/courses/${masterCourse}/blueprint_templates/default/associated_courses`, (err, courses) => {
//     deleteCourses(courses);
// });

var byeBye = [7792, 8012, 8013, 8019, 8034]
    .map((num, i) => {
        return {
            id: num,
            name: i + 1
        };
    });
    
console.log(byeBye);
deleteCourses(byeBye);