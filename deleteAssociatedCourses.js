const canvas = require('canvas-wrapper');
const masterCourse = 4870;

canvas.get(`/api/v1/courses/${masterCourse}/blueprint_templates/default/associated_courses`, (err, courses) => {
    console.log(err);
    courses.forEach(course => {
        canvas.delete(`/api/v1/courses/${course.id}?event=delete`, (err) => {
            if (err) {
                console.log(err);
                return;
            };
            console.log(`Course Deleted: ${course.name}`);
        });
    });
});