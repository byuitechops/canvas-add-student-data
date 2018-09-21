const fs = require('fs');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');
const moment = require('moment');
const d3dsv = require('d3-dsv');

module.exports = (instructorCSV) => {
/***************************** the file name needs to change */
//remove the BOM off the front of the file
    var csv = fs.readFileSync(instructorCSV, 'utf8').replace(/^\uFEFF/, '');
    /*********************************************************** */

    var badPeople = [],
        missingIs = [],
        missingEmail = [],
        noEmailInSystem = [];


    function fixInumber(number) {
        if(number === undefined){
            return null;
        }

        try {
            number = trimOrBlank(number);
            //remove spaces, dashes and pad front with 0s
            var numberOut = number
                .replace(/ /g, "")
                .replace(/-/g, "")
                .padStart(9, '0');

            var checkIs9Numbers = /\d{9}/;
            if (numberOut === '000000000' || !checkIs9Numbers.test(numberOut)) {
                return null;
            }
        } catch (e) {
            console.log(number);
            console.log(numberOut);
            console.log(e.message);
            throw new Error("Something wrong with iNumber");
        }
        return numberOut;
    }

    function fixEmail(email) {
        email = trimOrBlank(email);
        var checkIsStudnetEmail = /([a-z]+|[a-z]{3}\d+)@byui.edu/i,
            checkIsByuiEmail = /[a-z0-9]+@byui.edu/i;

        //some emails are not real
        if ((email === '@byui.edu' || !(checkIsStudnetEmail.test(email))) && checkIsByuiEmail.test(email)) {
            return null;
        }
        return email.toLowerCase();
    }

    function fixName(nameIn) {
        return nameIn.split(' ')
        //Proper Case the name field 
            .map(namePart => {
            //shouldn't need trim because of split on space but just in case, 
                namePart = namePart.trim();
                //lowerCase everything
                namePart = namePart.toLowerCase();
                //upper the first
                namePart = namePart[0].toUpperCase() + namePart.slice(1);

                return namePart;
            }).join(' ');//put all the parts back together
    }

    function fixCanvasId(canvasId) {
    //if we don't have one then set it to null
        if (canvasId === undefined) {
            return null;

        }
        return canvasId.trim();
    }

    function trimOrBlank(string) {
        if (string) {
            return string.trim();
        }
        return "";
    }

    var csvData = d3dsv.csvParse(csv, (d) => {

        return {
            name: fixName(d.name),
            iNumber: fixInumber(d.iNumber),
            email: fixEmail(d.email),
            canvasId: fixCanvasId(d.canvasId)
        };
    });

    //check for dups
    //right now it does it by name we should also check on all the other fields too.
    var dups = csvData.map(guy => guy.name).sort().filter((guy, i, arr) => {
        return i < arr.length && arr[i + 1] === guy;
    });
    if (dups.length > 0) {
        console.log("FYI these names have at least 2 people that have the same name");
        console.log(dups);
    }




    function searchCanvas(instructor, callback) {
        var apiCall;

        function missingInumberOrCanvasId() {
            console.log('Missing iNumber and canvasID for', instructor.name);
            missingIs.push(instructor);
            callback(null, null);
        }

        //see if we have what we need
        //if no iNumber and no canvasId
        if (instructor.iNumber === null && instructor.canvasId === null) {
            missingInumberOrCanvasId();
            return;
        }

        //if no email
        if (instructor.email === null) {
            console.log('Missing email for', instructor.name);
            missingEmail.push(instructor);
            callback(null, null);
            return;
        }

        //use iNumber if you have it else use canvasId
        if (instructor.iNumber !== null) {
        //add on include email so we get that too
            apiCall = `/api/v1/accounts/1/users?search_term=${instructor.iNumber}&include[]=email`;
        } else if (instructor.canvasId !== null) {
            apiCall = `/api/v1/users/${instructor.canvasId}`;
        } else {
            missingInumberOrCanvasId();
            return;
        }




        // search by iNumber
        canvas.get(apiCall, function (err, userArr) {

            var matchingUser;

            function listBad(e) {
                if (e) {
                    console.log('ERROR', e);
                }
                console.log("CSV=", JSON.stringify(instructor, null, 4));
                if (userArr && userArr[0]) {
                    console.log("Canvas first user in list", JSON.stringify(userArr[0], null, 4));
                }
                console.log('---------------------------------');
                badPeople.push(instructor);
                callback(null, null);
            }

            //just check if something exploded 
            if (err) {
                listBad(err);
                return;
            }

            function checkName(csvUser, canvasUser) {
                return csvUser.name === canvasUser.name;
            }
            function checkEmail(instructor, canvasUser) {
                return instructor.email.toLowerCase() === canvasUser.email.toLowerCase();
            }

            //if we didn't get any back from the api call
            if (userArr.length === 0) {
                listBad();
                return;
            }

            //See if we have someone that has a matching name or matching email
            matchingUser = userArr.find(function (canvasUser) {
                return checkName(instructor, canvasUser) || checkEmail(instructor, canvasUser);
            });

            //if we didn't get one that matched on name or email its bad
            if (typeof matchingUser === "undefined") {
                listBad();
                return;
            } else {
                callback(null, matchingUser);
            }

        });
    }

    function csvMaker(array) {
        return d3dsv.csvFormat(array);
    }

    function jsonMaker(array) {
        return JSON.stringify(array, null, 4);
    }

    function mapCallBack(err, peopleObjects) {
        if (err) {
            console.log(err);
        } else {
        /* Reduce wouldn't work -- just filtering out nulls here instead */
            peopleObjects = peopleObjects.filter(item => item !== null);
            console.log('Found Users:', peopleObjects.length);
            console.log('Bad Users:', badPeople.length);
            var date = moment().format('D-MMM-YY h-m-sa');
            var ending = '.json';
            var processor = jsonMaker;

            fs.writeFileSync(`./${date}_dateUserData.json`, JSON.stringify(peopleObjects, null, 4));
            if (badPeople.length > 0) {
                var makeCSV = true;

                if (makeCSV) {
                    ending = '.csv';
                    processor = csvMaker;
                }

                fs.writeFileSync(`./${date}_BadUsers${ending}`, processor(badPeople));
                fs.writeFileSync(`./${date}_MissingI${ending}`, processor(missingIs));
                fs.writeFileSync(`./${date}_MissingE${ending}`, processor(missingEmail));
                fs.writeFileSync(`./${date}_MissingEInSystem${ending}`, processor(noEmailInSystem));
            }
        }
    }


    asyncLib.mapLimit(csvData, 25, searchCanvas, mapCallBack);
};