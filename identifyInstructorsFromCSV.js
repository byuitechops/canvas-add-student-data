const fs = require('fs');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');
const moment = require('moment');
const d3dsv = require('d3-dsv');

//remove the BOM off the front of the file
var csv = fs.readFileSync('./oneOnline.csv', 'utf8').replace(/^\uFEFF/, '');

var badPeople = [];



var csvData = d3dsv.csvParse(csv, (d, i) => {
    return {
        lastname: d.lastname.trim(),
        //middlename: d.middlename.trim(),
        firstname: d.firstname.trim(),
        username: d.username.trim(),
        // Inumber: d.INumber.replace(/-/g, "").padStart(9, '0'),
        //email: d.email.trim(),
        canvasUserID: +d.canvasUserID.trim()
    };
});

var dups = csvData.map(guy => `${guy.firstname} ${guy.lastname}`).sort().filter((guy, i, arr) => {
    return i < arr.length && arr[i + 1] === guy;
});
if (dups.length > 0) {
    console.log("FYI these names have at least 2 people that have the same name");
    console.log(dups);
}




function searchCanvas(instructor, callback) {
    var searchTerm = instructor.firstname + " " + instructor.lastname;
    canvas.get(`/api/v1/accounts/1/users?search_term=${searchTerm}`, function (err, userArr) {


        var checkFunction,
            matchingUser;

        if (err) {
            console.log('ERROR', err);
            badPeople.push(instructor);
            callback(null, null);
        }

        function listBad() {
            console.log("CSV=", JSON.stringify(instructor, null, 4));
            console.log("Canvas first user in list", JSON.stringify(userArr[0], null, 4));
            console.log('---------------------------------');
            badPeople.push(instructor);
            callback(null, null);
        }

        function checkUsername(csvUser, canvasUser) {
            return csvUser.username.toLocaleLowerCase() === canvasUser.login_id.toLocaleLowerCase();
        }

        function checkInumber(csvUser, canvasUser) {
            return csvUser.Inumber === canvasUser.sis_user_id;
        }
        function checkUserId(csvUser, canvasUser){
            return csvUser.canvasUserID === canvasUser.id;
        }


        if (userArr.length === 0) {
            listBad();
            return;
        }

        //get the check function
        if (instructor.Inumber &&  instructor.Inumber !== '') {
            checkFunction = checkInumber;
        } else if (instructor.canvasUserID !== 0) {
            checkFunction = checkUserId;
        } else if(instructor.username !== '' ){
            checkFunction = checkUsername;
        }

        // get matching user
        matchingUser = userArr.find(function (canvasUser) {
            return checkFunction(instructor, canvasUser)
        });

        //check if we got one
        if (typeof matchingUser === "undefined") {
            listBad();
            return;
        } else {
            callback(null, matchingUser);
        }

    });
}

function mapCallBack(err, peopleObjects) {

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
}


asyncLib.mapLimit(csvData, 25, searchCanvas, mapCallBack);