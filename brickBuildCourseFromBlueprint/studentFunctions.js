const asyncLib = require('async');
const path = require('path');
const canvasAPICalls = require( path.join(__dirname, '../canvasAPICalls.js') );
const populateDrifter = require( path.join(__dirname, '../populateDrifter.js') );
const submitQuiz = require( path.join(__dirname, '../submitQuiz.js') );
const fs = require('fs');
const moment = require('moment');
const issues = [];
const chalkAnimation = require('chalk-animation');

function makeDiscussionPosts(drifter, waterCallback) {

    var posts = [{
        student: drifter.students.hope,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.hope.posts[0]
    }, {
        student: drifter.students.eugene,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.eugene.posts[0]
    }, {
        student: drifter.students.guy,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.guy.posts[0]
    }, {
        student: drifter.students.ima,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.ima.posts[0]
    }, {
        student: drifter.students.charli,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.charli.posts[0]
    }, {
        student: drifter.students.alice,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.alice.posts[0]
    }, {
        student: drifter.students.david,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.david.posts[0]
    },];

    function makeDiscussionPost(postObj, eachCallback) {
        canvasAPICalls.submitDiscussionPost(postObj.student.id, postObj.boardId, drifter.course.id, postObj.message, (discErr, entryId) => {
            if (discErr) {
                eachCallback(discErr);
                return;
            }

            drifter.discussions.topic.entries.push(entryId);
            console.log(`${drifter.courseNumber} | ${drifter.course.id} | Discussion post created for student ID: ${postObj.student.id}`);
            eachCallback(null);
        });
    }

    drifter.discussions.topic.entries = [];

    asyncLib.eachSeries(posts, makeDiscussionPost, (err) => {
        if (err) {
            waterCallback(err);
            return;
        }

        waterCallback(null, drifter);
    });
}

function makeDiscussionPostReplies(drifter, waterCallback) {

    var posts = [{
        // Post 1
        entryId: drifter.discussions.topic.entries[0],
        student: drifter.students.eugene,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.eugene.replies[0]
    }, {
        entryId: drifter.discussions.topic.entries[0],
        student: drifter.students.alice,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.alice.replies[0]
    }, {
        // Post 2
        entryId: drifter.discussions.topic.entries[1],
        student: drifter.students.david,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.david.replies[0]
    }, {
        entryId: drifter.discussions.topic.entries[1],
        student: drifter.students.ima,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.ima.replies[0]
    }, {
        // Post 3
        entryId: drifter.discussions.topic.entries[2],
        student: drifter.students.eugene,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.eugene.replies[1]
    }, {
        entryId: drifter.discussions.topic.entries[2],
        student: drifter.students.guy,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.guy.replies[0]
    }, {
        entryId: drifter.discussions.topic.entries[2],
        student: drifter.students.david,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.david.replies[1]
    }, {
        // Post 4
        entryId: drifter.discussions.topic.entries[3],
        student: drifter.students.charli,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.charli.replies[0]
    }, {
        entryId: drifter.discussions.topic.entries[3],
        student: drifter.students.alice,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.alice.replies[1]
    }, {
        // Post 5
        entryId: drifter.discussions.topic.entries[4],
        student: drifter.students.ima,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.ima.replies[1]
    }, {
        entryId: drifter.discussions.topic.entries[4],
        student: drifter.students.guy,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.guy.replies[1]
    }, {
        // Post 6
        entryId: drifter.discussions.topic.entries[5],
        student: drifter.students.guy,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.guy.replies[2]
    }, {
        entryId: drifter.discussions.topic.entries[5],
        student: drifter.students.hope,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.hope.replies[0]
    }, {
        // Post 7
        entryId: drifter.discussions.topic.entries[6],
        student: drifter.students.hope,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.hope.replies[1]
    }, {
        entryId: drifter.discussions.topic.entries[6],
        student: drifter.students.charli,
        boardId: drifter.discussions.topic.id,
        message: drifter.students.charli.replies[1]
    },];

    function makeDiscussionPost(postObj, eachCallback) {
        canvasAPICalls.submitDiscussionPostReply(postObj.student.id, postObj.boardId, postObj.entryId, drifter.course.id, postObj.message, (discErr, replyId) => {
            if (discErr) {
                eachCallback(discErr);
                return;
            }
            console.log(`${drifter.courseNumber} | ${drifter.course.id} | Discussion post reply created for student ID: ${postObj.student.id}`);
            eachCallback(null);
        });
    }

    asyncLib.eachSeries(posts, makeDiscussionPost, (err) => {
        if (err) {
            waterCallback(err);
            return;
        }

        waterCallback(null, drifter);
    });
}

function makeQuizSubmissions(drifter, waterCallback) {
    function submitStudentQuiz(student, eachCallback) {
        if (!student.quizSubmissions) {
            eachCallback(null);
            return;
        }
        submitQuiz(student.id, student.quizSubmissions.quiz1.quizId(), drifter.course.id, student.quizSubmissions.quiz1.answers, (err) => {
            if (err) {
                eachCallback(err);
                return;
            }
            console.log(`${drifter.courseNumber} | ${drifter.course.id} | Quiz ${student.quizSubmissions.quiz1.quizId()} submitted for student ${student.id}`);
            submitQuiz(student.id, student.quizSubmissions.quiz2.quizId(), drifter.course.id, student.quizSubmissions.quiz2.answers, (err) => {
                if (err) {
                    eachCallback(err);
                    return;
                }
                console.log(`${drifter.courseNumber} | ${drifter.course.id} | Quiz ${student.quizSubmissions.quiz2.quizId()} submitted for student ${student.id}`);
                eachCallback(null);
            });
        });
    }

    asyncLib.eachSeries(drifter.students, submitStudentQuiz, (err) => {
        if (err) {
            waterCallback(err);
            return;
        }
        waterCallback(null, drifter);
    });
}

function makeGroupCategories(drifter, waterCallback) {
    function makeGroupCategory(groupCatObj, eachCallback) {
        canvasAPICalls.makeGroupCategory(drifter.course.id, groupCatObj.settings, (cbErr, newCategory) => {
            if (cbErr) {
                eachCallback(cbErr);
                return;
            }
            groupCatObj.id = newCategory.id;
            console.log(`${drifter.courseNumber} | ${drifter.course.id} | Group Category Created: ${groupCatObj.settings.name}`);
            eachCallback(null);
        });
    }

    asyncLib.eachSeries(drifter.groupCategories, makeGroupCategory, (err) => {
        if (err) {
            waterCallback(err);
            return;
        }
        waterCallback(null, drifter);
    });
}

function makeGroups(drifter, waterCallback) {
    function makeGroup(groupObj, eachCallback) {
        canvasAPICalls.makeGroup(drifter.groupCategories.groupAssignments.id, groupObj.name, (cbErr, newGroup) => {
            if (cbErr) {
                eachCallback(cbErr);
                return;
            }
            groupObj.id = newGroup.id;
            console.log(`${drifter.courseNumber} | ${drifter.course.id} | Group Created: ${groupObj.name} ${groupObj.id}`);
            eachCallback(null);
        });
    }

    asyncLib.eachSeries(drifter.groupCategories.groupAssignments.groups, makeGroup, (err) => {
        if (err) {
            waterCallback(err);
            return;
        }
        waterCallback(null, drifter);
    });
}

function putStudentsInGroups(drifter, waterCallback) {
    function addStudents(groupObj, eachCallback) {
        canvasAPICalls.enrollStudentsInGroup(groupObj.id, groupObj.students, (cbErr, updatedGroup) => {
            if (cbErr) {
                eachCallback(cbErr);
                return;
            }
            console.log(`${drifter.courseNumber} | ${drifter.course.id} | Group Enrollments Created: ${groupObj.name} | ${groupObj.students}`);
            eachCallback(null);
        });
    }

    asyncLib.eachSeries(drifter.groupCategories.groupAssignments.groups, addStudents, (err) => {
        if (err) {
            waterCallback(err);
            return;
        }
        waterCallback(null, drifter);
    });
}

function makeAssignmentSubmissions(drifter, waterCallback) {

    function makeAssignmentSubmission(student, eachCallback) {

        function submitAssignment(file, key, eCB) {
            if (typeof file === 'number') {
                canvasAPICalls.submitAssignmentById(student.id, drifter.assignments[key].id, drifter.course.id, file, (discErr, submission) => {
                    if (discErr) {
                        eCB(discErr);
                        return;
                    }
                    console.log(`${drifter.courseNumber} | ${drifter.course.id} | Assignment (File) Submitted: ${file} | Student: ${student.id}`);
                    eCB(null);
                });
            } else {
                canvasAPICalls.submitAssignmentText(student.id, drifter.assignments[key].id, drifter.course.id, file, (discErr, submission) => {
                    if (discErr) {
                        eCB(discErr);
                        return;
                    }
                    console.log(`${drifter.courseNumber} | ${drifter.course.id} | Assignment (Text) Submitted - Student: ${student.id}`);
                    eCB(null);
                });
            }
        }

        asyncLib.eachOf(student.files, submitAssignment, eachCallback);
    }

    asyncLib.eachSeries(drifter.students, makeAssignmentSubmission, (err) => {
        if (err) {
            waterCallback(err);
            return;
        }
        waterCallback(null, drifter);
    });
}

function makeGroupSubmissions(drifter, waterCallback) {

    function submitAssignment(groupObj, eCB) {
        canvasAPICalls.submitAssigmentURL(groupObj.groupLeader, drifter.assignments.url.id, drifter.course.id, groupObj.link, (discErr, submission) => {
            if (discErr) {
                eCB(discErr);
                return;
            }
            console.log(`${drifter.courseNumber} | ${drifter.course.id} | Assignment (URL) Submitted: ${groupObj.name} | URL: ${groupObj.link}`);
            eCB(null);
        });
    }

    asyncLib.eachSeries(drifter.groupCategories.groupAssignments.groups, submitAssignment, (err) => {
        if (err) {
            waterCallback(err);
            return;
        }
        waterCallback(null, drifter);
    });
}


module.exports = (jsonDataFileLocation) => {
    return new Promise((resolve, reject) => {
        /******************************************* this file has to change or be passed in as an obj */
        var data = fs.readFileSync(jsonDataFileLocation);
        
        var dataObjects = JSON.parse(data);

        asyncLib.eachSeries(dataObjects.slice(0), (courseData, eachCallback) => {

            var functionCalls = [
                asyncLib.constant(courseData),
                populateDrifter,
                makeDiscussionPosts,
                makeDiscussionPostReplies,
                makeQuizSubmissions,
                makeGroupCategories,
                makeGroups,
                putStudentsInGroups,
                makeAssignmentSubmissions,
                makeGroupSubmissions
            ];

            asyncLib.waterfall(functionCalls, (waterErr, results) => {
                if (waterErr) {
                    eachCallback(waterErr);
                    console.log(waterErr);
                    issues.push({
                        course: courseData.course.id,
                        teacher: courseData.teacher.name,
                        error: waterErr
                    });
                    eachCallback(null);
                    return;
                }
                chalkAnimation.rainbow(`Completed waterfall for course: ${courseData.teacher.name} Sandbox | ${courseData.course.id}`);
                eachCallback(null);
            });

        }, (eachErr) => {
            if (eachErr) return reject(eachErr);
            chalkAnimation.rainbow('Completed All Courses');
            setTimeout(() => {
                console.log('\n');
            }, 3000);
            if (issues.length > 0) {
                fs.appendFileSync(`./studentDataIssues${moment().format('d-M--H-m')}.json`, JSON.stringify(issues));
            }
            resolve();
        });

    });
};