const fs = require('fs');
const asyncLib = require('async');
const canvas = require('canvas-wrapper');
const moment = require('moment');

var goodEnrollments = [];
var badEnrollments = [];

function enrollTeacher(courseData, callback) {

    var enrollmentObj = {
        enrollment: {
            user_id: courseData.teacher.id,
            type: 'TeacherEnrollment',
            enrollment_state: 'active',
            notify: false
        }
    };

    canvas.post(`/api/v1/courses/${courseData.course.id}/enrollments`, enrollmentObj, (err, success) => {
        if (err) {
            console.log(err);
            badEnrollments.push({
                teacher: courseData,
                err: err,
                message: 'Error Enrolling'
            });
            callback(null);
            return;
        }
        console.log(`${courseData.course.id} | ${courseData.teacher.name} has been enrolled in their Sandbox course.`);
        goodEnrollments.push({
            teacher: courseData,
            err: err,
            message: 'Successful Enrollment'
        });
        callback(null);
    });
}
/********************************************* the file name needs to change or just an obj passed in */
var toEnroll = JSON.parse(fs.readFileSync('./jilaneCourse.json', 'utf8'));

asyncLib.eachLimit(toEnroll.slice(0), 25, enrollTeacher, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    var date = moment().format('D-MMM-YY hh-mm-sa');
    if (goodEnrollments.length > 0) fs.writeFileSync(`./successfulEnrollments_${date}.json`, JSON.stringify(goodEnrollments, null, 4));
    if (badEnrollments.length > 0) fs.writeFileSync(`./badEnrollments_${date}.json`, JSON.stringify(badEnrollments, null, 4));

    console.log('Enrollments complete.');
});
