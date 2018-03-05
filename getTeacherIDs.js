const d3 = require('d3-dsv');
const fs = require('fs');
const asyncLib = require('async');
const canvas = require('canvas-wrapper');

var teacherList = d3.csvParse(fs.readFileSync('teacherList.csv', 'utf8'));
var fullList = d3.csvParse(fs.readFileSync('fullList.csv', 'utf8'));
var validNames = teacherList.map(teacher => teacher.long_name.split('  Sandbox')[0]);
var toEnroll = JSON.parse(fs.readFileSync('realAccounts.JSON', 'utf8'));

// var validPeople = fullList.filter(person => {
//     if (validNames.includes(`${person.first_name} ${person.last_name}`)) {
//         var index = validNames.indexOf(`${person.first_name} ${person.last_name}`);
//         validNames.splice(index, 1);
//         return true;
//     } else {
//         return false;
//     }
// });

// console.log(validNames);

// var teacherObjects = validPeople.map(person => {
//     return {
//         name: `${person.first_name} ${person.last_name}`,
//         id: person.user_id,
//         login_id: person.login_id
//     };
// });

// var badTeachers = [];

// function getID(teacher, mapCallback) {
//     canvas.get(`/api/v1/accounts/1/users?search_term=${teacher.id}`, (err, user) => {
//         if (err) {
//             console.log(err);
//             badTeachers.push(teacher);
//             mapCallback(null, teacher);
//             return;
//         }
//         mapCallback(null, {
//             id: user[0].id,
//             formerID: teacher.id,
//             name: teacher.name
//         });
//     });
// }

var badEnrollments = [];

function enrollTeacher(teacher, callback) {

    var enrollmentObj = {
        enrollment: {
            user_id: teacher.id,
            type: 'TeacherEnrollment',
            enrollment_state: 'active',
            notify: false
        }
    };

    canvas.get(`/api/v1/accounts/8/courses?search_term=${teacher.name} Sandbox`, (gerr, course) => {
        if (gerr) {
            console.log(gerr);
            badEnrollments.push({
                teacher: teacher,
                err: gerr,
                message: 'finding course'
            });
            callback(null);
            return;
        }

        if (course[0].course_code != teacher.name.split(' ')[0]) {
            course = course[1];
            console.log(course.course_code, teacher.name);
        } else {
            course = course[0];
            console.log(course.course_code, teacher.name);
        }

        canvas.post(`/api/v1/courses/${course.id}/enrollments`, enrollmentObj, (err, success) => {
            if (err) {
                console.log(gerr);
                badEnrollments.push({
                    teacher: teacher,
                    err: gerr,
                    message: 'enrollment'
                });
                callback(null);
                return;
            }
            callback(null);
        });
    });
}

// asyncLib.mapLimit(teacherObjects, 15, getID, (err, realAccounts) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

console.log(toEnroll.length);

// fs.writeFileSync('./realAccounts.json', JSON.stringify(toEnroll, null, '\t'));

asyncLib.eachLimit(toEnroll.slice(50, toEnroll.length - 1), 25, enrollTeacher, (err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log('COMPLETE, YA NICKIN CHUGGETS');
});

// });