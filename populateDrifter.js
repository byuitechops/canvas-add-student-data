const asyncLib = require('async');
const canvas = require('canvas-api-wrapper');
const Drifter = require('./drifter.js');
var count = 0;

module.exports = (courseData, callback) => {
    count++;
    var drifter = new Drifter(count);

    function setItems(object, cb) {

        function setItem(item, eachCallback) {
            canvas.get(`${object.uri}?search_term=${item.search}`, (err, assignmentArr) => {
                if (err) {
                    eachCallback(err);
                    return;
                }
                item.id = assignmentArr[0].id;
                eachCallback(null);
            });
        }

        asyncLib.each(object.items, setItem, (err) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null);
        });
    }

    drifter.course.id = courseData.course.id;

    var itemObjs = [{
        uri: `/api/v1/courses/${drifter.course.id}/assignments`,
        items: drifter.assignments
    }, {
        uri: `/api/v1/courses/${drifter.course.id}/discussion_topics`,
        items: drifter.discussions
    }, {
        uri: `/api/v1/courses/${drifter.course.id}/quizzes`,
        items: drifter.quizzes
    }];

    asyncLib.each(itemObjs, setItems, (err) => {
        if (err) {
            callback(err);
            return;
        }

        callback(null, drifter);
    });
};