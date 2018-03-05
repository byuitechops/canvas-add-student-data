var canvas = require('canvas-wrapper');
var fs = require('fs');

canvas.get(`/api/v1/courses/4274/blueprint_templates/default/associated_courses`, (err, courses) => {
   if (err) {
       console.log(err);
       return;
   }
   var fullCourses = courses.map(course => {
    return {
        course: {
            name: course.name,
            id: course.id
        }
    }
   });
   fs.writeFile('./createdCourses.json', JSON.stringify(fullCourses, null, '\t'));
});