const canvas = require('canvas-wrapper');

module.exports = (studentKey, boardId, courseId, post, cb) => {

    canvas.changeUser(studentKey);
    console.log('RUNNING');

    // Temp message to submit
    var entry = {
        'message': post
    };

    /* POST the entry to canvas */
    canvas.post(`/api/v1/courses/${courseId}/discussion_topics/${boardId}/entries`, entry, (err, postedEntry) => {
        if (err) {
            cb(err);
            return;
        }

        cb(null, postedEntry);
    });
};