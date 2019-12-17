const d3 = require('d3-dsv');
const asyncLib = require('async');
const fs = require('fs');
const path = require('path');
const canvas = require('canvas-api-wrapper');
var moment = require('moment');
const Drifter = require( path.join(__dirname, '../drifter.js') );
var drifter = new Drifter();
const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
//for a diff in time
require('moment-precise-range-plugin');

module.exports = (enrollFileLocation, sandboxSubAccount, masterCourseNumber, syncingComment) => {
// /********************************************************** these need to be parameters*/
    const subAccountNumber = sandboxSubAccount; //sandbox sub account
    const masterCourse = masterCourseNumber; // masterCourseNumber: (online default is 4272) (campus default is 4274)
    var enrollFile = fs.readFileSync(enrollFileLocation, 'utf8');
    var syncingCommentForCanvas = syncingComment;
    /******************************************** */
    // Get names from cSV
    // var csv = d3.csvParse(enrollFile);
    var instructors = JSON.parse(enrollFile);
    var failedCourses = [];
    var count = 0;


    // Create course
    function makeCourse(courseData) {
        return new Promise((resolve, reject) => {
            var putObj = {
                course: {
                    'name': courseData.teacher.name + ' Sandbox',
                },
                'offer': true
            };
            canvas.post(`/api/v1/accounts/${subAccountNumber}/courses`, putObj, (err, newCourse) => {
                if (err) {
                    failedCourses.push(courseData);
                    reject(err);
                    return;
                }

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

            var firstTry = true;

            function addBluePrintParent(cb) {
                canvas.put(`/api/v1/courses/${masterCourse}/blueprint_templates/default/update_associations`, putObject, (err, data) => {
                    if(firstTry){
                        firstTry = false;
                        var retryingWords = '';
                    } else {
                        retryingWords = chalk.magenta('Retrying : ');
                    }

                    console.log(`${retryingWords}Setting parent blueprint for ${courseData.teacher.name} Sandbox | ${courseData.course.id}.`);
                    cb(err,data);
                });
            }

            asyncLib.retry({
                times: 3,
                interval: 2000
            },
            addBluePrintParent,
            (err, success) => {
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

            asyncLib.eachSeries(drifter.students, (student, callback) => {

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
                    console.log(`Sync state: ${migrationDets.workflow_state}`);
                    if (migrationDets[0].workflow_state != 'completed') {
                        setTimeout(() => {
                            check();
                        }, 1000 * 30);
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
                    'comment': syncingCommentForCanvas
                };
                var started = moment();
                console.log('Sync started at', started.format('h:mm:ss a'));

                canvas.post(`/api/v1/courses/${masterCourse}/blueprint_templates/default/migrations`, postObj, (err, migration) => {
                    if (err) return reject(err);
                    checkMigration(migration)
                        .then(() => {
                            var ended = moment();
                            console.log("Ended Sync at:", ended.format('h:mm:ss a'));
                            console.log("It took:", moment.preciseDiff(started, ended));
                            resolve(courseObjects);

                        })
                        .catch(reject);
                });
            }, 3000);
        });
    }



    // Main is the only thing that is returned, and the only thing that needs to be run, 
    // but it needs to scope of the other functions and data on the document...
    var main = () => {
        var num = instructors.slice(0);

        return new Promise((resolve, reject) => {
            asyncLib.mapSeries(num, (teacher, mapCB) => {
                var courseData = {
                    teacher: {
                        name: teacher.name,
                        id: teacher.id
                    }
                };

                makeCourse(courseData)
                    .then(makeBluePrintChild)
                    .then(enrollStudents)
                    .then(courseData => {
                        courseData.status = 'success';
                        count++;
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
                //write out the data
                var goodCourses = courseObjects.filter(item => item.status === 'success');
                var badCourses = courseObjects.filter(item => item.status != 'success');
                var date = moment().format('D-MMM-YY h-m-sa');
                console.log(chalk.greenBright('GOOD COURSES: ') + goodCourses.length);
                console.log(chalk.redBright('BAD COURSES: ') + badCourses.length);
                var createdCoursesFilePathJson = `./createdCourses${date}.json`;
                var failedCoursesFilePathJson = `./failedCourses${date}.json`;
                fs.writeFileSync(createdCoursesFilePathJson, JSON.stringify(goodCourses, null, '\t'));
                fs.writeFileSync(failedCoursesFilePathJson , JSON.stringify(badCourses , null, '\t'));
                console.log(chalk.yellow('Data written to JSON Files'));

                console.log('Beginning Sync Process...');
                // Filter out bad courses BEFORE sync AND write JSON files before sync
                syncAssociatedCourses(courseObjects)
                    .then(() => {
                        console.log('DONE Syncing Courses');
                        resolve(createdCoursesFilePathJson);
                    })
                    .catch(reject);
            });
        });
    };
    return main(); // here the returned value of main is returned to module.exports when envoked
};