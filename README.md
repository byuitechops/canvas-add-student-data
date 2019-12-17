# Canvas Add Student Data
This is a CLI that creates student submission data in all the courses linked to a specific Canvas blue print master course.

## Requirements

## Required CSV Format
name      |email         |iNumber   |canvasId
----------|--------------|----------|--------
First Last|email@byui.edu|1234567890|12345671

You must have (`name` OR `email`) AND (`iNumber` OR `canvasId`)\
Meaning, you must have the `name` column filled out, or you must have the `email` column filled out. Additionally, you must also have the `iNumber` column filled out, or you must have the `canvasId` column filled out. 

### Enroll Students Into course
1. Enroll four students into the course
1. Two students will do all the submitting
1. Other two students are there only for group actions


### Quizzes

1. Two students compleat one quiz that contains five auto feedback questions
1. Two students compleat one quiz that is contain two teacher graded questions


### Discussion Board

1. Two students submit posts to one discussion board
1. A total of five posts alternating between the two students


### Assignments

1. One assignment that requires a **MS Word** file uploaded with two students submissions
1. One assignment that requires a **MS Excel** file uploaded with two students submissions
1. One assignment that requires a **PDF** file uploaded with two students submissions
1. One assignment that requires a **Plane Text** typed in with two students submissions
1. One group assignment that requires only one student from each group to submit a **URL** typed in


### Groups

1. Enroll all four students into a group set called *Teacher Editable* so teachers can practice editing groups
   * Two groups with two students each
1. Enroll the four students into a group set called *Group Assignment* for assignments requirement number five.
   * Two groups with two students each
   * Make sure that the two students that do the submitting end up in different groups 

## Execution Process

### Drifter

```js
var drifter = {
    course: {id : "string"}
    students : {
        alice:{
            id: "string",
            key : "string"
        },
        ...
    },
    admin : {
        id: "string",
        key : "string"
    },
    messages : [
        {
            name: "string",
            worked : bool,
            message : "string"
        },
        ...
    ],
    quizzes : {
        name: {
            id: "string",
            search: "string"
        },
        ...
    },
    discussions : {
        name: {
            id: "string",
            search: "string"
        },
        ...
    },
    assignments : {
        name: {
            id: "string",
            search: "string"
        },
        ...
    },
    groups : {
        name: {
            id: "string",
            search: "string"
        },
        ...
    }
}
```

