const auth = require('./auth.json');

var drifter = {
    course: {
        id: "80" // This will need to be dynamic
    },
    students: {
        alice: {
            id: "string", // Do we need these at all?
            key: "10706~pc9Xet4wma3BBVv41fHtab7cVEsvVI9BOTJ6b9KbEMuleIyZXgZIO6wXJ8iz4IVi"
        },
        bob: {
            id: "string",
            key: "10706~C0dlbzueLfUZGyqJvtyCn26WPJcvD3gtQout8Ox0BSaLiAV01tnlp2aSks1XgUYK"
        },
        charli: {
            id: "string",
            key: "10706~4v9A2GNJmNDILSO0iOxXZLknH29KmJinTRXF292vJZzLGT8JTm4dbDJZ1XyUuSJi"
        },
        david: {
            id: "string",
            key: "10706~6TMQqWl0m2e0NMmudpFn8ZvGAg2p4ECO9TgaHhx74K4wc0cQXqlUt8CjEwm06xjq"
        },
        eugene: {
            id: "string",
            key: "string"
        },
        faith: {
            id: "string",
            key: "string"
        },
        guy: {
            id: "string",
            key: "string"
        },
        hope: {
            id: "string",
            key: "string"
        },
        ima: {
            id: "string",
            key: "string"
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