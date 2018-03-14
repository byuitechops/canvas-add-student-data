const fs = require('fs');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');
const moment = require('moment');
const d3dsv = require('d3-dsv');

//remove the BOM off the front of the file
var csv = fs.readFileSync('./InstructorList.csv', 'utf8').replace(/^\uFEFF/, '');;

var badPeople = [];



var csvData = d3dsv.tsvParse(csv, (d,i) => {
    return {
        lastname: d.lastname,
        middlename: d.middlename,
        firstname: d.firstname,
        username: d.username,
        Inumber: d.INumber.replace(/-/g, "").padStart(9,'0'),
        email: d.email,
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
        // if (userArr.length > 0 && instructor.username.toLocaleLowerCase() === userArr[0].login_id.toLocaleLowerCase()) {
        if (userArr.length > 0 && instructor.Inumber === userArr[0].sis_user_id) {
        callback(null, userArr[0]);
        } else {
            console.log("CSV=", JSON.stringify(instructor,null,4));
            console.log("Canvas", JSON.stringify(userArr[0],null,4));
            console.log('---------------------------------');
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
        fs.writeFileSync(`./UserData-(${moment().format('d-M H-m')}).json`, JSON.stringify(peopleObjects, null, 4));
        if (badPeople.length > 0) {
            fs.writeFileSync(`./BadUsers-(${moment().format('d-M H-m')}).json`, JSON.stringify(badPeople, null, 4));
        }
    }
});