const canvas = require('canvas-wrapper');
//canvas.changeUser(process.env.TOKEN);

function makeQuizzes(studentId, quizId, courseId, answersArr, cb) {

    function createQuizSubmission() {
        /* POST to canvas to create the quiz submission */
        canvas.post(`/api/v1/courses/${courseId}/quizzes/${quizId}/submissions?as_user_id=${studentId}`, {}, (err, quizSubmission) => {
            if (err) {
                cb(err);
                return;
            }
            answerQuestions(quizSubmission.quiz_submissions[0]);
        });
    }

    function answerQuestions(quizSubmission) {

        /* The quiz question object we'll be submitting */
        var questionsObj = {
            "attempt": quizSubmission.attempt,
            "validation_token": quizSubmission.validation_token,
            "access_code": null,
            "quiz_questions": []
        };

        /* Get the questions and possible answers */
        canvas.get(`/api/v1/quiz_submissions/${quizSubmission.id}/questions?as_user_id=${studentId}&include[]=quiz_question`, (getErr, questions) => {
            if (getErr) {
                console.log(getErr);
                submitQuiz(quizSubmission);
                return;
            }

            /* Prepare the answer objects */
            // console.log(JSON.stringify(questions));
            // console.log('ANSWERS ARR: ', JSON.stringify(questions[0].quiz_questions, null, '\t'));
            questionsObj.quiz_questions = questions[0].quiz_submission_questions.map((question, index) => {
                return {
                    "id": question.id,
                    "answer": answersArr[index] || question.answers[Math.floor(Math.random() * question.answers.length)].id
                };
            });
            // questionsObj.quiz_questions = [];
            // console.log(JSON.stringify(questions, null, '\t'));

            /* Set the answers in Canvas, so it'll take these answers when the quiz is submitted */
            sendAnswers(quizSubmission, questionsObj, (quizSubmission) => {
                submitQuiz(quizSubmission);
            });

        });
    }

    function sendAnswers(quizSubmission, questionsObj, callback) {
        canvas.postJSON(`/api/v1/quiz_submissions/${quizSubmission.id}/questions?as_user_id=${studentId}`, questionsObj, (postErr, newQuestions) => {
            if (postErr) {
                console.log(postErr);
                callback(quizSubmission);
                return;
            }

            callback(quizSubmission);

        });
    }

    function submitQuiz(quizSubmission) {
        var completeObj = {
            'attempt': quizSubmission.attempt,
            'validation_token': quizSubmission.validation_token
        };

        /* Tell Canvas to complete the quiz */
        canvas.post(`/api/v1/courses/${courseId}/quizzes/${quizId}/submissions/${quizSubmission.id}/complete?as_user_id=${studentId}`, completeObj, (err, quizSubmission) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, quizSubmission);
        });

    }
    createQuizSubmission();
}



module.exports = makeQuizzes;