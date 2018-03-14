const canvas = require('canvas-wrapper');


function submitQuiz(studentId, courseId, quizId, quizSubmission) {
    var completeObj = {
        'attempt': quizSubmission.attempt,
        'validation_token': quizSubmission.validation_token
    };

    /* Tell Canvas to complete the quiz */
    canvas.post(`/api/v1/courses/${courseId}/quizzes/${quizId}/submissions/${quizSubmission.id}/complete?as_user_id=${studentId}`, completeObj, (err, quizSubmission) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Submitted Quiz\n');
    });

}


canvas.get(`/api/v1/courses/9431/quizzes/78342/submissions`, (err, submissions) => {
    if (err) console.log(err);
    else {
        submitQuiz(submissions[0].quiz_submissions[0].user_id, 9431, 78342, submissions[0].quiz_submissions[0]);
    }


    canvas.get(`/api/v1/courses/9431/quizzes/78341/submissions`, (err, submissions) => {
        if (err) console.log(err);
        else {
            submitQuiz(submissions[0].quiz_submissions[0].user_id, 9431, 78341, submissions[0].quiz_submissions[0]);
        }

    });
});