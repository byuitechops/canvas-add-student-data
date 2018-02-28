/* eslint no-unused-vars:0 */
/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const auth = require('./auth.json');


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


makeGroupsForGroupCategory(auth.token, 332, 80, 'TEST GROUP', (err, newGroup) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(newGroup);
});








// TODO: didn't test this
function enrollStudentInGroup(adminKey, studentId, groupId, courseId, cb) {
    canvas.changeUser(adminKey);
    // the call that needs to be be made
    // https://canvas.instructure.com/doc/api/groups.html#method.group_memberships.create
    var apiCall = `/api/v1/groups/${groupId}/memberships`,
        settings = {
            user_id: studentId
        };

    // make the group category and the groups
    canvas.post(apiCall, settings, (err, groupCategory) => {
        if (err) {
            cb(err, null);
            return;
        }

        // returns group 
        cb(null, groupCategory);
    });
}



// makeGroup(adminKey, courseId, settings, cb) {
// makeGroup(process.env.ADMIN_KEY, 80, groupCategories[1], (err, data) => {
/* makeGroup(auth.token, 80, {}, (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data);
}); */