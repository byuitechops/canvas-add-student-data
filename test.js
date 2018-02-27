// var db = require('./makeDiscussionPost.js');
var quiz = require('./submitQuiz.js');
var canvas = require('canvas-wrapper');
var popDrif = require('./populateDrifter.js');
var drifter = require('./drifter.js');

// var tempKey = '10706~C0dlbzueLfUZGyqJvtyCn26WPJcvD3gtQout8Ox0BSaLiAV01tnlp2aSks1XgUYK';

// var answersObject = [
//     0, 1, 2
// ];

// quiz(tempKey, '50536', '80', answersObject, (err, quizSubmission) => {
//     if (err) console.log(err);
//     else {
//         console.log('complete');
//     }
// });


// db(tempKey, '81588', '80', 'THE WORLD ISN\'T FLAT, ALICE.', (err, newPost) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log('SUCCESS');
// });

popDrif(drifter, (err) => {
    if (err) console.log(err);
    else {
        console.log('SUCCESS');
    }
});