const canvas = require('canvas-wrapper');

module.exports = (studentKey, courseId, topicId, message, cb) => {
    canvas.changeUser(studentKey);
    var entry = {
        'message': message
    };
    canvas.post(`/api/v1/courses/${courseId}/discussion_topics/${topicId}/entries`, entry, (err, postedEntry) => {
        if (err)
            cb(err, postedEntry);
        else
            cb(null, postedEntry);
    });
};