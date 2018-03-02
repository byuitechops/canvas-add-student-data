const d3 = require('d3-dsv');
const asyncLib = require('async');
const fs = require('fs');
const canvas = require('canvas-wrapper');
const masterCourse = 4870;
const drifter = require('./drifter.js');
const chalk = require('chalk');

// Get names from cSV
var enrollFile = fs.readFileSync('enrollList.csv', 'utf8');
var csv = d3.csvParse(enrollFile);
var failedCourses = [];

// Get user ID
function getTeacherObject(teacher) {
    return new Promise((resolve, reject) => {
        canvas.get(`/api/v1/accounts/1/users?search_term=${teacher.user_id}`, (err, user) => {
            if (err) reject(err);
            resolve({
                teacher: {
                    id: user[0].id,
                    name: user[0].name
                }
            });
        });
    });
}

// Create course
function makeCourse(courseData) {
    return new Promise((resolve, reject) => {
        var putObj = {
            course: {
                'name': courseData.teacher.name + ' Sandbox',
            },
            'offer': true
        };
        canvas.post(`/api/v1/accounts/13/courses`, putObj, (err, newCourse) => {
            if (err) reject(err);
            courseData.course = {
                id: newCourse.id
            };
            console.log(`${chalk.cyanBright('Course Created')}: ${courseData.teacher.name} Sandbox | ${courseData.course.id}`);
            resolve(courseData);
        });
    });
}

// Associate course
function makeBluePrintChild(courseData) {
    return new Promise((resolve, reject) => {
        var putObject = {
            'course_ids_to_add': courseData.course.id
        };

        canvas.put(`/api/v1/courses/${masterCourse}/blueprint_templates/default/update_associations`, putObject, (err, success) => {
            if (err) {
                failedCourses.push(courseData);
                return reject(err);
            }
            console.log(`${chalk.greenBright('Course Associated')}: ${courseData.teacher.name} Sandbox | ${courseData.course.id}`);
            resolve(courseData);
        });
    });
}

// Enroll students
function enrollStudents(courseData) {
    return new Promise((resolve, reject) => {

        asyncLib.each(drifter.students, (student, callback) => {

            var enrollmentObj = {
                enrollment: {
                    user_id: student.id,
                    type: 'StudentEnrollment',
                    enrollment_state: 'active'
                }
            };

            canvas.post(`/api/v1/courses/${courseData.course.id}/enrollments`, enrollmentObj, (err, success) => {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null);
            });


        }, (err) => {
            if (err) return reject(err);
            resolve(courseData);
        });
    });
}

function checkMigration(migration) {
    return new Promise((resolve, reject) => {

        function check() {
            canvas.get(`/api/v1/courses/${masterCourse}/blueprint_templates/default/migrations/${migration.id}`, (err, migrationDets) => {
                if (err) return reject(err);
                console.log(`Sync state: ${migrationDets[0].workflow_state}`);
                if (migrationDets[0].workflow_state != 'completed') {
                    setTimeout(() => {
                        check();
                    }, 2000);
                } else {
                    resolve();
                }
            });
        }

        check();
    });
}

function syncAssociatedCourses(courseObjects) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var postObj = {
                'comment': 'Initial sandbox course creation content sync.'
            };

            canvas.post(`/api/v1/courses/${masterCourse}/blueprint_templates/default/migrations`, postObj, (err, migration) => {
                if (err) return reject(err);
                checkMigration(migration)
                    .then(() => {
                        resolve(courseObjects);
                    })
                    .catch(reject);
            });
        }, 3000);
    });
}

module.exports = () => {
    return new Promise((resolve, reject) => {
        asyncLib.mapLimit(csv.slice(0, 20), 20, (teacher, mapCB) => {

            getTeacherObject(teacher)
                .then(makeCourse)
                .then(makeBluePrintChild)
                .then(enrollStudents)
                .then(courseData => {
                    courseData.status = 'success';
                    mapCB(null, courseData);
                })
                .catch((err) => {
                    console.log(err);
                    mapCB(null, {
                        teacher: teacher,
                        status: 'failed',
                        error: JSON.stringify(err)
                    });
                });

        }, (eachErr, courseObjects) => {
            if (eachErr) {
                console.log(eachErr);
                return;
            }

            syncAssociatedCourses(courseObjects)
                // .then(getContentIDs)
                .then((courseDataObjects) => {
                    var goodCourses = courseDataObjects.filter(item => item.status === 'success');
                    var badCourses = courseDataObjects.filter(item => item.status != 'success');
                    console.log(chalk.greenBright('GOOD COURSES: ') + goodCourses.length);
                    console.log(chalk.redBright('BAD COURSES: ') + badCourses.length);
                    fs.writeFileSync('./createdCourses.json', JSON.stringify(goodCourses, null, '\t'));
                    fs.writeFileSync('./failedCourses.json', JSON.stringify(badCourses, null, '\t'));
                    console.log(chalk.yellow('Data written to JSON Files'));
                    resolve();
                })
                .catch(reject);
        });
    });
}