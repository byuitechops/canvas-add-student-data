const fs = require('fs');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');
const moment = require('moment');

var csv = fs.readFileSync('./InstructorList.csv').toString();

var badPeople = [];

var csvData = csv.split('\r');

csvData = csvData.map(person => {
    var details = person.split('\t');

    return {
        lastname: details[0],
        middlename: details[1],
        firstname: details[2],
        username: details[3],
        Inumber: details[4],
        email: details[5],
    };
});

console.log(csvData.length);


asyncLib.mapLimit(csvData, 25, (instructor, callback) => {

    canvas.get(`/api/v1/accounts/1/users?search_term=${instructor.Inumber}`, (err, userArr) => {
        if (err) {
            console.log('ERROR', err);
            badPeople.push(instructor);
            callback(null, null);
        }
        if (userArr.length > 0 /*&& instructor.username === userArr[0].login_id*/) {
            callback(null, userArr[0]);
        } else {
            badPeople.push(instructor);
            callback(null, null);
        }
    });
}, (err, peopleObjects) => {
    if (err) {
        console.log(err);
    } else {
        /* Reduce wouldn't work -- just filtering out nulls here instead */
        peopleObjects = peopleObjects.filter(item => item !== null);
        console.log('Found Users:', peopleObjects.length);
        console.log('Bad Users:', badPeople.length);
        fs.writeFileSync(`./UserData-(${moment().format('d-M H-m')}).json`, JSON.stringify(peopleObjects, null, '\t'));
        if (badPeople.length > 0) {
            fs.writeFileSync(`./BadUsers-(${moment().format('d-M H-m')}).json`, JSON.stringify(badPeople, null, '\t'));
        }
    }
});