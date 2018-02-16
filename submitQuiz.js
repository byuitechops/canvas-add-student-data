const canvas = require('canvas-wrapper');
const myAuth = require('./auth.json');

module.exports = (studentKey, quizId, courseId, answersObject, cb) => {

    canvas.changeUser(studentKey);

    function submitQuiz(quizSubmission) {

        var completeObj = {
            'attempt': quizSubmission.attempt,
            'validation_token': quizSubmission.validation_token
        };

        /* Tell Canvas to complete the quiz */
        canvas.post(`/api/v1/courses/${courseId}/quizzes/${quizId}/submissions/${quizSubmission.id}/complete`, completeObj, (err, quizSubmission) => {
            if (err) {
                cb(err);
                return;
            }

            cb(null, quizSubmission);
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
        canvas.get(`/api/v1/quiz_submissions/${quizSubmission.id}/questions`, (getErr, questions) => {
            if (getErr) {
                console.log(getErr);
                return;
            }

            /* Prepare the answer objects */
            // console.log(JSON.stringify(questions));
            questionsObj.quiz_questions = questions[0].quiz_submission_questions.map((question, index) => {
                return {
                    "id": `${question.id}`,
                    "answer": question.answers[answersObject[index]].id
                };
            });
            console.log(questionsObj);
            console.log(JSON.stringify(questions));

            /* Set the answers in Canvas, so it'll take these answers when the quiz is submitted */
            canvas.post(`/api/v1/quiz_submissions/${quizSubmission.id}/questions`, questionsObj, (postErr, newQuestions) => {
                console.log('RESULT', newQuestions);

                if (postErr) {
                    console.log(postErr);
                    return;
                }

                submitQuiz(quizSubmission);
            });

        });
    }

    function createQuizSubmission() {
        /* POST to canvas to create the quiz submission */
        canvas.post(`/api/v1/courses/${courseId}/quizzes/${quizId}/submissions`, {}, (err, quizSubmission) => {
            if (err) {
                cb(err);
                return;
            }
            console.log(quizSubmission);
            answerQuestions(quizSubmission.quiz_submissions[0]);
        });
    }


    createQuizSubmission();

};