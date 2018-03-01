const addData = require('./canvasAPICalls.js');
const drifter = require('./drifter.js');
const asyncLib = require('async');

function createGroups(courseData) {
    return new Promise((resolve, reject) => {

    });
}

function addDiscussionPosts(courseData) {
    return new Promise((resolve, reject) => {
        // for each discussion board.... make the following posts
        var discussions = courseData.course.discussions;
        addData.submitDiscussionPost(
            drifter.students.alice.key,
            discussions.topic.id,
            courseData.course.id,
            discussions.topic.posts[0],
            (err, entryID) => {
                if (err) return reject(err);
                discussions.entries.push(entryID);
                resolve()
            });







        // asyncLib.each(courseData.course.discussions, (discussion, callback) => {
        // }, (err) => {
        //     if (err) return reject(err);
        //     resolve();
        // });
    });
}

function addQuizSubmissions(courseData) {
    return new Promise((resolve, reject) => {

    });
}

function addAssignmentSubmissions(courseData) {
    return new Promise((resolve, reject) => {

    });
}

module.exports = (courseDataObjects) => {
    return new Promise((resolve, reject) => {

        function buildData(courseData) {

        }

        asyncLib.each(courseDataObjects, buildData, (err) => {
            if (err) return reject(err);
            resolve(courses);
        });
    });
}
// Take a single course
// Create groups
// Submit discussion posts
//