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
            id: "34729"
        },
        charli: {
            id: "34730",
            files: {
                docx: 441469,
                pdf: 441466,
                xlsx: 441467,
                plainText: 441468
            }
        },
        david: {
            id: "34731",
            files: {
                docx: 441474,
                pdf: 441471,
                xlsx: 441472,
                plainText: 441473
            }
        },
        eugene: {
            id: "34766",
            files: {
                docx: 441478,
                pdf: 441475,
                xlsx: 441476,
                plainText: 441477
            }
        },
        faith: {
            id: "34767",
        },
        guy: {
            id: "34768",
            files: {
                docx: 441482,
                pdf: 441479,
                xlsx: 441480,
                plainText: 441481
            }
        },
        hope: {
            id: "34769",
            files: {
                docx: 441486,
                pdf: 441483,
                xlsx: 441484,
                plainText: 441485
            }
        },
        ima: {
            id: "34770",
            files: {
                docx: 441490,
                pdf: 441487,
                xlsx: 441488,
                plainText: 441489
            }
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