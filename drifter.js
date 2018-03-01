const auth = require('./auth.json');

var drifter = {
    course: {
        id: "80" // This will need to be dynamic
    },
    students: {
        alice: {
            id: "34728",
            files: {
                docx: 441358,
                pdf: 441355,
                xlsx: 441356,
                plainText: 441357
            }
        },
        bob: {
            id: "34729",
        },
        charli: {
            id: "34730",
        },
        david: {
            id: "34731",
        },
        eugene: {
            id: "34766",
        },
        faith: {
            id: "34767",
        },
        guy: {
            id: "34768",
        },
        hope: {
            id: "34769",
        },
        ima: {
            id: "34770",
        },
    },
    admin: { // Can this pull from local auth.json?
        id: auth.id,
        key: auth.token
    },
    messages: [{ // This is a template message
        name: "string",
        worked: true,
        message: "string"
    }, ],
    quizzes: { // This and below needs to be dynamically discovered based on name or URL
        multipleChoice: {
            id: "string",
            search: "Example Quiz 1"
        },
        essayQuestions: {
            id: "string",
            search: "Example Quiz 2"
        },
    },
    discussions: {
        topic: {
            id: "string",
            search: "Example Discussion 1",
            entries: [],
        },
    },
    assignments: {
        pdf: {
            id: "string",
            search: "Example Assignment 1"
        },
        docx: {
            id: "string",
            search: "Example Assignment 2"
        },
        xlsx: {
            id: "string",
            search: "Example Assignment 3"
        },
        group: {
            id: "string",
            search: "Example Assignment 4"
        },
    },
    groups: {
        name: {
            id: "string",
            search: "string"
        },
    }
};

module.exports = drifter;