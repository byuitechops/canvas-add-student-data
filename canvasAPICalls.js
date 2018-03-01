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

function submitDiscussionPost(studentId, boardId, courseId, post, cb) {
    canvas.post(`/api/v1/courses/${courseId}/discussion_topics/${boardId}/entries?as_user_id=${studentId}`, {
        'message': post
    }, (err, postedEntry) => {
        if (err)
            cb(err);
        else
            cb(null, postedEntry.id);
    });
}

// Haven't tried this, but should work
function submitDiscussionPostReply(studentId, boardId, entryId, courseId, post, cb) {
    canvas.post(`/api/v1/courses/${courseId}/discussion_topics/${boardId}/entries/${entryId}/replies?as_user_id=${studentId}`, {
        'message': post
    }, (err, postedEntry) => {
        if (err)
            cb(err);
        else
            cb(null, postedEntry.id);
    });
}

function submitAssignmentById(studentId, assignmentId, courseId, fileId, cb) {
    var url = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions?as_user_id=${studentId}`,
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

function submitAssignmentText(studentId, assignmentId, courseId, text, cb) {
    var url = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions?as_user_id=${studentId}`,
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
function makeGroupCategory(courseId, settings, cb) {
    /* settings should contain name and optional groupCount */
    var url = `/api/v1/courses/${courseId}/group_categories`,
        postObj = {
            category: settings
        };

    /* make the group category and the groups */
    canvas.post(url, postObj, (err, groupCategory) => {
        if (err) {
            cb(err, null);
            return;
        }
        /* returns group */
        cb(null, groupCategory);
    });
}

function makeGroup(groupCategoryId, name, cb) {
    /* set uri & postObj */
    var url = `/api/v1/group_categories/${groupCategoryId}/groups`,
        postObj = {
            name: name,
        };
    /* Create a new group */
    canvas.post(url, postObj, (postErr, newGroup) => {
        if (postErr) {
            cb(postErr, newGroup);
            return;
        }
        cb(null, newGroup);
    });
}

function enrollStudentsInGroup(adminKey, groupId, students, cb) {
    /* join all students into a comma separated string */
    var url = `/api/v1/groups/${groupId}`,
        settings = {
            "members": `${students.join(',')}`
        };
    /* Set all students in the group */
    canvas.put(url, settings, (err, changedGroup) => {
        if (err) {
            cb(err);
            return;
        }
        cb(null, changedGroup);
    });
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
    makeGroupCategory: makeGroupCategory,
    enrollStudentsInGroup: enrollStudentsInGroup,
    enrollStudentInCourse: enrollStudentInCourse,
    addGroupSettingsToAssignment: addGroupSettingsToAssignment
};