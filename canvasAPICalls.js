/* eslint no-unused-vars:0 */


/* Student Level Calls */

function submitQuiz(studentKey, quizId, courseId, submission, cb){
    //start a submission
    //https://canvas.instructure.com/doc/api/quiz_submissions.html#method.quizzes/quiz_submissions_api.create
    //send the answers
    //watch out for attempt number - should just be 1
    //https://canvas.instructure.com/doc/api/quiz_submission_questions.html#method.quizzes/quiz_submission_questions.answer

}

function submitDiscussionPost(studentKey, boardId, courseId, post, cb){

}

function submitAssignmentUpload(studentKey, assignmentId, courseId, filePath, cb){

}

function submitAssignmentText(studentKey, assignmentId, courseId, text, cb){
    
}

/* Admin Level Calls*/
function makeGroup(adminKey, courseId, settings, cb){
    //returns group id
}

function enrollStudentInGroup(adminKey, studentId, groupId, courseId, cb){

}

function enrollStudentInCourse(adminKey, studentId, courseId, cb){

}

function addGroupSettingsToAssignment(adminKey, assignmentId, courseId, settings, cb){

}


module.exports = {
    submitQuiz: submitQuiz,
    submitDiscussionPost : submitDiscussionPost,
    submitAssignmentUpload : submitAssignmentUpload,
    submitAssignmentText : submitAssignmentText,
    makeGroup : makeGroup,
    enrollStudentInGroup: enrollStudentInGroup,
    enrollStudentInCourse : enrollStudentInCourse,
    addGroupSettingsToAssignment : addGroupSettingsToAssignment
};