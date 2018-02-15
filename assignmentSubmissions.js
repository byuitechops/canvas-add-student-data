const canvas = require('canvas-wrapper');
// const auth = require('./auth.json');



function submitAssignment(url, postObj, cb) {
    canvas.post(url, postObj, (err, submissions) => {
        if (err)
            cb(err, submissions);
        else
            cb(null, submissions);
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


module.exports  = {
    submitAssignmentText: submitAssignmentText,
    submitAssignmentById: submitAssignmentById,
};

// FOR TESTING

/* submitAssignmentText(auth.token, 92265, 80, '<html><body><h1>I worked very hard on this. I deserve an A.</h1></body></html>', (err, submission) => {
    if (err) console.error(err);
    else console.log(submission);
}); */

/* submitAssignmentById(auth.token, 92269, 80, 380876, (err, submission) => {
    if (err) console.error(err);
    else console.log(submission);
}); */