/* eslint no-unused-vars:0 */
/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const myAuth = require('./auth.json').token;
const studentAuth = require('./studentAuth.json').token;
const request = require('request');


var groupCategories = [{
    name: "Teacher Editable",
    self_signup: false,
    create_group_count: 2
},
{
    category: {
        name: "Group Assignment"
    }
}
];

function makeGroupCategory(adminKey, courseId, settings, cb) {
    /* set the user */
    canvas.changeUser(adminKey);

    /* settings can contain name, self-signup, and groupCount */
    var postObj = {
        category: settings
    };

    var url = `/api/v1/courses/${courseId}/group_categories`;

    /* make the group category and the groups */
    canvas.post(url, postObj, (err, groupCategory) => {
        if (err) {
            cb(err, null);
            return;
        }

        /* returns group */
        cb(null, groupCategory);
    });
}

function makeGroup(adminKey, groupCategoryId, name, cb) {
    canvas.changeUser(adminKey);

    var uri = `/api/v1/group_categories/${groupCategoryId}/groups`,
        postObj = {
            name: name,
        };

    canvas.post(uri, postObj, (postErr, newGroup) => {
        if (postErr) {
            cb(postErr, newGroup);
            return;
        }
        cb(null, newGroup);
    });
}


function enrollStudentsInGroup(adminKey, groupId, students, cb) {
    canvas.changeUser(adminKey);

    var uri = `/api/v1/groups/${groupId}`,
        settings = {
            "members": `${students.join(',')}`
        };

    canvas.put(uri, settings, (err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log(response);
    });
}

// enrollStudentsInGroup(myAuth, 1302, [34728,34729,34730,34731,34766], (err, something) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log(something);
// });

// makeGroupCategory(adminKey, courseId, settings, cb) {
/* makeGroupCategory(process.env.ADMIN_KEY, 80, groupCategories[1], (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data);
}); */


/* makeGroup(myAuth, 332, 80, 'TEST GROUP', (err, newGroup) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(newGroup);
}); */