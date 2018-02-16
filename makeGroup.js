/* eslint no-unused-vars:0 */

var canvas = require('canvas-wrapper');

function makeGroupCategory(adminKey, courseId, settings, cb) {
    var apiCall = `/api/v1/courses/${courseId}/group_categories`;
    
    //set the user
    canvas.changeUser(adminKey);

    //make the group category and the groups
    canvas.post(, settings, (err, groupCategory) => {
        if (err) {
            cb(err, null);
            return;
        }

        //returns group 
        cb(null, groupCategory);
    });



}

function makeGroupsForGroupCategory(adminKey, groupCategoryId, courseId, settings, cb){

}

//TODO: didn't test this
function enrollStudentInGroup(adminKey, studentId, groupId, courseId, cb) {


    //the call that needs to be be made
    //https://canvas.instructure.com/doc/api/groups.html#method.group_memberships.create
    var apiCall = `/api/v1/groups/${groupId}/memberships`,
        settings = {
            user_id: studentId
        };

    //
    //set the user
    canvas.changeUser(adminKey);

    //make the group category and the groups
    canvas.post(apiCall, settings, (err, groupCategory) => {
        if (err) {
            cb(err, null);
            return;
        }

        //returns group 
        cb(null, groupCategory);
    });


}


var groupCategories = [{
        category: {
            name: "Teacher Editable",
            self_signup: false,
            create_group_count: 2
        }
    },
    {
        category: {
            name: "Group Assignment"
        },
        groups: [
            //TODO: this structure might need some help based on the api
            [student1, student2],
            [student3, student4]
        ]
    }
];



makeGroup(process.env.ADMIN_KEY, 80, groupCategories[1], (err, data) => {
    if (err) {
        return console.log(err);
    }
    console.log(data);
});

