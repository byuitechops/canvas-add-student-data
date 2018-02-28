/* eslint no-unused-vars:1 */
const canvas = require('canvas-wrapper');

/*** Student Level Calls ***/

function submitQuiz(studentKey, quizId, courseId, submission, cb) {
    // start a submission
    // https://canvas.instructure.com/doc/api/quiz_submissions.html#method.quizzes/quiz_submissions_api.create
    // send the answers
    // watch out for attempt number - should just be 1
    // https://canvas.instructure.com/doc/api/quiz_submission_questions.html#method.quizzes/quiz_submission_questions.answer

    //ALMOST WORKING- API CALL WONT TAKE THE DANG QUESTIONS

}

function submitDiscussionPost(studentKey, boardId, courseId, post, cb) {
    canvas.changeUser(studentKey);
    var entry = {
        'message': post
    };
    canvas.post(`/api/v1/courses/${courseId}/discussion_topics/${boardId}/entries`, entry, (err, postedEntry) => {
        if (err)
            cb(err, postedEntry.id);
        else
            cb(null, postedEntry.id);
    });
}

// Haven't tried this, but should work
function submitDiscussionPostReply(studentKey, boardId, entryId, courseId, post, cb) {
    canvas.changeUser(studentKey);
    var entry = {
        'message': post
    };
    canvas.post(`/api/v1/courses/${courseId}/discussion_topics/${boardId}/entries/${entryId}/replies`, entry, (err, postedEntry) => {
        if (err)
            cb(err);
        else
            cb(null, postedEntry.id);
    });
}

function submitAssignmentById(studentKey, assignmentId, courseId, fileId, cb) {
    canvas.changeUser(studentKey);
    var url = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions`,
        postObj = {
            "submission[submission_type]": 'online_upload',
            "submission[file_ids][]": `${fileId}`,
        };
    submitAssignment(url, postObj, (err, submission) => {
        if (err) {
            cb(err);
            return;
        }

        cb(null, submission);
    });
}

function submitAssignmentText(studentKey, assignmentId, courseId, text, cb) {
    canvas.changeUser(studentKey);
    var url = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/`,
        postObj = {
            submission: {
                submission_type: 'online_text_entry',
                body: text
            }
        };

    submitAssignment(url, postObj, (err, submission) => {
        if (err) {
            cb(err);
            return;
        }

        cb(null, submission);
    });
}

/*** helper functions ***/
function submitAssignment(url, postObj, cb) {
    canvas.post(url, postObj, (err, submissions) => {
        if (err)
            cb(err, submissions);
        else
            cb(null, submissions);
    });
}

/*** Admin Level Calls ***/
function makeGroupCategory(adminKey, courseId, settings, groupCount, cb) {
    // returns group id
}

// what params will this need?
function makeGroup(adminKey, groupCategoryId, name, cb) {

}

function enrollStudentInGroup(adminKey, studentId, groupId, courseId, cb) {

}

function enrollStudentInCourse(adminKey, studentId, courseId, cb) {

}

function addGroupSettingsToAssignment(adminKey, assignmentId, courseId, settings, cb) {

}


module.exports = {
    submitQuiz: submitQuiz,
    submitDiscussionPost: submitDiscussionPost,
    submitDiscussionPostReply: submitDiscussionPostReply,
    submitAssignmentById: submitAssignmentById,
    submitAssignmentText: submitAssignmentText,
    makeGroup: makeGroup,
    enrollStudentInGroup: enrollStudentInGroup,
    enrollStudentInCourse: enrollStudentInCourse,
    addGroupSettingsToAssignment: addGroupSettingsToAssignment
};