const asyncLib = require('async');
const canvasAPICalls = require('./canvasAPICalls.js');
const populateDrifter = require('./populateDrifter.js');

function makeDiscussionPosts(drifter, waterCallback) {

    var posts = [{
        student: drifter.students.alice,
        boardId: drifter.discussions.topic.id,
        message: 'THE MOON LANDING WAS DONE WITH TINFOIL AND A BAD VIDEO CAMERA'
    }, {
        student: drifter.students.bob,
        boardId: drifter.discussions.topic.id,
        message: 'CONSPIRACY THEORIES ARE THE WORST'
    }, {
        student: drifter.students.charli,
        boardId: drifter.discussions.topic.id,
        message: 'LET US OFT SPEAK KIND WOOOOOORDS TO EACH OTHERRRRR'
    }, {
        student: drifter.students.david,
        boardId: drifter.discussions.topic.id,
        message: 'HI GUYS'
    }, ];

    function makeDiscussionPost(postObj, eachCallback) {
        canvasAPICalls.submitDiscussionPost(postObj.student.key, postObj.boardId, drifter.course.id, postObj.message, (discErr, entryId) => {
            if (discErr) {
                eachCallback(discErr);
                return;
            }

            drifter.discussions.topic.entries.push(entryId);
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
        entryId: drifter.discussions.topic.entries[0],
        student: drifter.students.bob,
        boardId: drifter.discussions.topic.id,
        message: 'WE ALL KNOW YOU DON\'T BELIEVE IN THE MOON LANDING, ALICE'
    }, {
        entryId: drifter.discussions.topic.entries[1],
        student: drifter.students.alice,
        boardId: drifter.discussions.topic.id,
        message: 'CONSPIRACY THEORIES ARE THE BEST'
    }, {
        entryId: drifter.discussions.topic.entries[0],
        student: drifter.students.bob,
        boardId: drifter.discussions.topic.id,
        message: 'NUH UH'
    }, ];

    function makeDiscussionPost(postObj, eachCallback) {
        canvasAPICalls.submitDiscussionPostReply(postObj.student.key, postObj.boardId, postObj.entryId, drifter.course.id, postObj.message, (discErr, replyId) => {
            if (discErr) {
                eachCallback(discErr);
                return;
            }
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

var functionCalls = [
    populateDrifter,
    makeDiscussionPosts,
    makeDiscussionPostReplies,
    makeAssignmentSubmissions
];

asyncLib.waterfall(functionCalls, (waterErr, results) => {
    if (waterErr) {
        console.log(waterErr);
        return;
    }

    console.log('Complete');
});