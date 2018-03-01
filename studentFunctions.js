const asyncLib = require('async');
const canvasAPICalls = require('./canvasAPICalls.js');
const populateDrifter = require('./populateDrifter.js');
const fs = require('fs');

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
    }, ];

    function makeDiscussionPost(postObj, eachCallback) {
        canvasAPICalls.submitDiscussionPost(postObj.student.id, postObj.boardId, drifter.course.id, postObj.message, (discErr, entryId) => {
            if (discErr) {
                eachCallback(discErr);
                return;
            }

            drifter.discussions.topic.entries.push(entryId);
            console.log(`Discussion post created for student ID: ${postObj.student.id}`);
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
    }, ];

    function makeDiscussionPost(postObj, eachCallback) {
        canvasAPICalls.submitDiscussionPostReply(postObj.student.key, postObj.boardId, postObj.entryId, drifter.course.id, postObj.message, (discErr, replyId) => {
            if (discErr) {
                eachCallback(discErr);
                return;
            }
            console.log(`Discussion post reply created for student ID: ${postObj.student.id}`);
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

function makeAssignmentSubmissions(drifter, waterCallback) {

    var submissions = [{
        student: drifter.students.bob,
        assignId: drifter.assignments.docx.id,
        text: 'ALICE BELIEVES IN THE MOON LANDING BUT WON\'T ADMIT IT',
    }, {
        student: drifter.students.david,
        assignId: drifter.assignments.docx.id,
        text: 'I dunno why the other two are always so mad',
    }, {
        student: drifter.students.alice,
        assignId: drifter.assignments.docx.id,
        text: 'SEE MY BLOG TO LEARN THE ABSOLUTE TRUTH ABOUT TOOTHPASTE',
    }, ];

    function makeAssignmentSubmission(assignObj, eachCallback) {
        canvasAPICalls.submitAssignmentText(assignObj.student.key, assignObj.assignId, drifter.course.id, assignObj.text, (discErr, replyId) => {
            if (discErr) {
                eachCallback(discErr);
                return;
            }
            eachCallback(null);
        });
    }

    asyncLib.eachSeries(submissions, makeAssignmentSubmission, waterCallback);
}




module.exports = () => {
    return new Promise((resolve, reject) => {

        var data = fs.readFileSync('./courseData.json');

        var dataObjects = JSON.parse(data);

        asyncLib.eachSeries(dataObjects, (courseData, eachCallback) => {

            var functionCalls = [
                asyncLib.constant(courseData),
                populateDrifter,
                makeDiscussionPosts,
                makeDiscussionPostReplies,
                makeAssignmentSubmissions
            ];

            asyncLib.waterfall(functionCalls, (waterErr, results) => {
                if (waterErr) {
                    eachCallback(waterErr);
                    return;
                }
                console.log('Completed waterfall for course');
                eachCallback(null);
            });

        }, (eachErr) => {
            if (eachErr) return reject(eachErr);
            console.log('Complete Each Course Waterfall');
            resolve();
        });

    });
};