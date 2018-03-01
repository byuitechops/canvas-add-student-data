const asyncLib = require('async');
const canvas = require('canvas-wrapper');
var drifter = require('./drifter.js');

module.exports = (callback) => {

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

        console.log(drifter);

        callback(null, drifter);
    });
};