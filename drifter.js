const auth = require('./auth.json');

var drifter = {
    course: {
        id: "80" // This will need to be dynamic
    },
    students: {
        alice: {
            id: "34728", // Do we need these at all?
            key: "10706~pc9Xet4wma3BBVv41fHtab7cVEsvVI9BOTJ6b9KbEMuleIyZXgZIO6wXJ8iz4IVi"
        },
        bob: {
            id: "34729",
            key: "10706~C0dlbzueLfUZGyqJvtyCn26WPJcvD3gtQout8Ox0BSaLiAV01tnlp2aSks1XgUYK"
        },
        charli: {
            id: "34730",
            key: "10706~4v9A2GNJmNDILSO0iOxXZLknH29KmJinTRXF292vJZzLGT8JTm4dbDJZ1XyUuSJi"
        },
        david: {
            id: "34731",
            key: "10706~6TMQqWl0m2e0NMmudpFn8ZvGAg2p4ECO9TgaHhx74K4wc0cQXqlUt8CjEwm06xjq"
        },
        eugene: {
            id: "34766",
            key: "string"
        },
        faith: {
            id: "34767",
            key: "string"
        },
        guy: {
            id: "34768",
            key: "string"
        },
        hope: {
            id: "34769",
            key: "string"
        },
        ima: {
            id: "34770",
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
            search: "L12: Quiz 1"
        },
        essayQuestions: {
            id: "string",
            search: "L12: Quiz 2"
        },
    },
    discussions: {
        topic: {
            id: "string",
            search: "L12 Discussion: Practice Take Aways",
            entries: [],
        },
    },
    assignments: {
        pdf: {
            id: "string",
            search: "L12 Practice: Basic Silhouettes and Shapes"
        },
        docx: {
            id: "string",
            search: "L12 Paper: This I Believe"
        },
        xlsx: {
            id: "string",
            search: "L12 Excel Practice: Personal Budget Project"
        },
        group: {
            id: "string",
            search: "L12 Group Activity: Modern Day Issues"
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