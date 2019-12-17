/* eslint no-console:0 */

const canvas = require('canvas-api-wrapper');
// const auth = require('./auth.json');



function submitAssignment(url, postObj, cb) {
    canvas.post(url, postObj, (err, submissions) => {
        if (err)
            cb(err, submissions);
        else
            cb(null, submissions);
    });
}

function submitAssignmentById(assignmentId, courseId, studentId, fileId, cb) {
    var url = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions?as_user_id=${studentId}`,
        postObj = {
            "submission[submission_type]": 'online_upload',
            "submission[file_ids][]": `${fileId}`,
        };
    submitAssignment(url, postObj, cb);
}

function submitAssignmentText(assignmentId, courseId, studentId, text, cb) {
    var url = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/?as_user_id=${studentId}`,
        postObj = {
            "submission[submission_type]": 'online_text_entry',
            "submission[body]": text
        };
    submitAssignment(url, postObj, cb);
}

function submitAssigmentURL(assignmentId, courseId, studentId, postUrl, cb) {
    var url = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions?as_user_id=${studentId}`,
        postObj = {
            "submission[submission_type]": 'online_url',
            "submission[url]": postUrl
        };

    submitAssignment(url, postObj, cb);
}

module.exports = {
    submitAssignmentText: submitAssignmentText,
    submitAssignmentById: submitAssignmentById,
};

// FOR TESTING
const studentId = 34728;
/*var textToSubmit = '<html><body><h1>I worked very hard on this. I deserve an A.</h1></body></html>';
submitAssignmentText(95014, 80, studentId, textToSubmit, (err, submission) => {
    if (err) console.error(err);
    else console.log(submission);
}); */

var urlToSubmit = 'https://www.google.com';
submitAssigmentURL(95015, 80, studentId, urlToSubmit, (err, stuff) => {
    if (err) console.error(err);
    else console.log(stuff);
});


/* submitAssignmentById(92269, 80, studentId, 380876, (err, submission) => {
    if (err) console.error(err);
    else console.log(submission);
}); */