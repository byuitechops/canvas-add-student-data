const d3 = require('d3-dsv');
const asyncLib = require('async');
const fs = require('fs');
const canvas = require('canvas-wrapper');
const masterCourse = 4870;
const drifter = require('./drifter.js');

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
                'blueprint': true
            }
        };
        canvas.post(`/api/v1/accounts/13/courses`, putObj, (err, newCourse) => {
            courseData.course = {
                id: newCourse.id
            };
            if (err) reject(err);
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
            console.log(`Course Complete: ${courseData.teacher.name} Sandbox`);
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
                    enrollment_state: 'inactive'
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

function getAssignments(courseData) {
    return new Promise((resolve, reject) => {
        asyncLib.map(drifter.assignments, (assignment, callback) => {

            canvas.get(`/api/v1/courses/${courseData.course.id}/assignments?search_term=${assignment.search}`, (getErr, result) => {
                if (getErr) {
                    callback(getErr);
                    return;
                }
                if (result) {
                    let newAssignment = {
                        name: assignment.search,
                        id: result[0].id
                    };
                    callback(null, newAssignment);
                } else {
                    console.log(`Assignment --- "${assignment.search}" was not found in the course!`);
                }
            });

        }, (err, assignmentObjects) => {
            if (err) return reject(err);
            courseData.course.assignments = assignmentObjects;
            resolve(courseData);
        });
    });
}

function getQuizzes(courseData) {
    return new Promise((resolve, reject) => {
        asyncLib.map(drifter.quizzes, (quiz, callback) => {

            canvas.get(`/api/v1/courses/${courseData.course.id}/quizzes?search_term=${quiz.search}`, (getErr, result) => {
                if (getErr) {
                    callback(getErr);
                    return;
                }
                if (result) {
                    let newQuiz = {
                        name: quiz.search,
                        id: result[0].id
                    };
                    callback(null, newQuiz);
                } else {
                    console.log(`Quiz --- "${quiz.search}" was not found in the course!`);
                }
            });

        }, (err, quizObjects) => {
            if (err) return reject(err);
            courseData.course.quizzes = quizObjects;
            resolve(courseData);
        });
    });
}

function getDiscussions(courseData) {
    return new Promise((resolve, reject) => {
        asyncLib.map(drifter.discussions, (discussion, callback) => {

            canvas.get(`/api/v1/courses/${courseData.course.id}/discussion_topics?search_term=${discussion.search}`, (getErr, result) => {
                if (getErr) {
                    callback(getErr);
                    return;
                }
                if (result) {
                    let newDiscussion = {
                        name: discussion.search,
                        id: result[0].id
                    };
                    callback(null, newDiscussion);
                } else {
                    console.log(`Discussion --- "${discussion.search}" was not found in the course!`);
                }
            });

        }, (err, discussionObjects) => {
            if (err) return reject(err);
            courseData.course.discussions = discussionObjects;
            resolve(courseData);
        });
    });
}

function getContentIDs(courseObjects) {
    return new Promise((resolve, reject) => {
        asyncLib.mapLimit(courseObjects, 20, (courseData, mapCallback) => {

            getAssignments(courseData)
                .then(getQuizzes)
                .then(getDiscussions)
                .then((newCourseData) => {
                    mapCallback(null, newCourseData);
                })
                .catch(mapCallback);

        }, (eachErr, newCourseObjects) => {
            if (eachErr) return reject(eachErr);
            resolve(newCourseObjects);
        });
    });
}

// function enrollTeacher(teacher) {

//     return new Promise((resolve, reject) => {

//         var enrollmentObj = {
//             enrollment: {
//                 user_id: teacher.id,
//                 type: 'TeacherEnrollment'
//             }
//         };

//         canvas.post(`/api/v1/courses/${teacher.course.id}/enrollments`, enrollmentObj, (err, success) => {
//             if (err) return reject(err);
//             resolve(teacher);
//         });
//     });
// }

module.exports = () => {
    return new Promise((resolve, reject) => {
        asyncLib.mapLimit(csv.slice(0, 3), 1, (teacher, mapCB) => {

            getTeacherObject(teacher)
                .then(makeCourse)
                .then(makeBluePrintChild)
                .then(enrollStudents)
                .then(courseData => {
                    mapCB(null, courseData);
                })
                .catch(mapCB);

        }, (eachErr, courseObjects) => {
            if (eachErr) {
                console.log(eachErr);
                console.log(failedCourses);
                return;
            }

            syncAssociatedCourses(courseObjects)
                .then(getContentIDs)
                .then((courses) => {
                    console.log(courses);
                    fs.writeFileSync('./courseData.json', JSON.stringify(courseObjects, null, '\t'));
                    console.log('Data written to "courseData.json"');
                    resolve(courses);
                })
                .catch(reject);
        });
    });
}