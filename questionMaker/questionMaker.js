/*************************************************************************
 * Requires and Variables
 *************************************************************************/
const fs = require('fs');
const inquirer = require('inquirer');
const targetFile = './questions.json';
var questionsFile = fs.readFileSync(targetFile, 'utf8');
var questionsJSON = JSON.parse(questionsFile);

const noBlankAnswer = (answer) => {
    if (answer === undefined || answer === null || answer === '') {
        console.log('You cannot leave this field blank!');
        return false;
    } else {
        return true;
    }
};

const stringToArray = (answer) => {
    return answer.split('|');
};

/*************************************************************************
 * Prototype for making newQuestions
 *************************************************************************/
var makeNewQuestionsPrompt = {
    type: {
        type: 'list',
        name: 'type',
        message: 'type*:',
        default: 'input',
        choices: Object.keys(inquirer.prompt.prompts),
        validate: noBlankAnswer,
        pageSize: 10,
        suffix: '(multi-choice)'
    },
    name: {
        type: 'input',
        name: 'name',
        message: 'name*:',
        default: null,
        validate: noBlankAnswer,
        suffix: '<str>:'
    },
    message: {
        type: 'input',
        name: 'message',
        message: 'message:',
        default: null,
        suffix: '<str>:'
    },
    default: {
        type: 'input',
        name: 'default',
        message: 'default:',
        default: null,
        suffix: '<str>:'
    },
    choices: {
        type: null,
        name: 'choices',
        message: 'choices:',
        default: null,
        filter: stringToArray,
        suffix: '(pipe-seperated-values)'
    },
    validate: {
        type: null,
        name: 'validate',
        message: null,
        default: null,
        suffix: '<fn>:'
    },
    filter: {
        type: null,
        name: 'filter',
        message: null,
        default: null,
        suffix: '<fn>:'
    },
    transformer: {
        type: null,
        name: 'transformer',
        message: null,
        default: null,
        suffix: '<fn>:'
    },
    when: {
        type: null,
        name: 'when',
        message: null,
        default: null,
        suffix: '<fn/bool>:'
    },
    pageSize: {
        type: null,
        name: 'pageSize',
        message: null,
        default: null,
        suffix: '<int>:'
    },
    prefix: {
        type: null,
        name: 'prefix',
        message: null,
        default: null,
        suffix: '<str>:'
    },
    suffix: {
        type: null,
        name: 'suffix',
        message: null,
        default: null,
        suffix: '<str>:'
    },
};

/*************************************************************************
 * The function that runs if the user wants to make a new question
 *************************************************************************/
const makeQuestion = async () => {
    const makeQuestionObject = (iAnswers) => {
        Object.keys(iAnswers).forEach(key => {
            if (iAnswers[key] === '' || (iAnswers[key].length === 1 && iAnswers[key][0] === '')) {
                delete iAnswers[key];
            }
        });
        console.log(iAnswers);
        return iAnswers;
    };
    console.log('You said you would like to make a new question. Here are some things to know:');
    console.log('');
    var newQuestion;
    // Transform the object into an array. It is declared initially as an object for reability
    var prompts = Object.keys(makeNewQuestionsPrompt).map(key => makeNewQuestionsPrompt[key]);
    // pass prompts array into inquirer
    await inquirer.prompt(prompts)
        .then((iAnswers) => newQuestion = makeQuestionObject(iAnswers))
        .catch();
    // add newly created question to questionsJSON, with a key corresponding with the newQuestion.name property
    questionsJSON[newQuestion.name] = newQuestion;
};

// TODO Solve Async issue
/*************************************************************************
 * The function that runs if the user wants to edit and existing question
 *************************************************************************/
const editQuestion = async () => {
    var editPrompt = {
        type: 'list',
        name: 'nameOfPrompt',
        message: 'Which prompt would you like to edit?',
        choices: Object.keys(questionsJSON)
    }
    var selectAttributes = {
        type: 'checkbox',
        name: 'attributesToChange',
        message: 'which attributes would you like to change?',
        choices: ['type', 'name', 'message', 'default', 'choices', 'validate', 'filter', 'transformer', 'when', 'pageSize', 'prefix', 'suffix'] 
    }
    const editAttributes = (iAnswers) => {
        questionsTemplate = Object.assign(makeNewQuestionsPrompt);
        iAnswers.attributesToChange.forEach((attribute) => {
            inquirer.prompt(questionsTemplate[attribute])
            .then((anotherAnswer) => {
                questionsJSON[iAnswers.nameOfPrompt][attribute] = anotherAnswer[attribute];
            });
        });
    }
    console.log('You said you would like to edit an existing question');
    console.log('Which question would you like to edit?');
    await inquirer.prompt([editPrompt, selectAttributes])
        .then(editAttributes)
        .catch(console.log)
};

/*************************************************************************
 * The function that writes the questionJSON to a formatted JSON file
 *************************************************************************/
const updateFile = () => {
    fs.writeFileSync(targetFile, JSON.stringify(questionsJSON, null, 4));
}

/*************************************************************************
 * The progarm will continue running until this function is invoked
 *************************************************************************/
const exitProgram = () => {
    updateFile();
    process.exit();
};

/*************************************************************************
 * setUpVars and setUpFunctions are the only two objects that need to be 
 * updated to change or expand the list of starting options.
 * >> setUpVars takes a new string which also acts as a choice
 * >> setUpFunctions takes a function to run depending on the choice made
 *************************************************************************/
var setUpVars = {
    makeQ: 'make question',
    editQ: 'edit question',
    exit: 'exit'
};
var setUpFunctions = {
    [setUpVars.makeQ]: makeQuestion,
    [setUpVars.editQ]: editQuestion,
    [setUpVars.exit] : exitProgram
};

/*************************************************************************
 * This is the question that is asked first in main
 *************************************************************************/
var setUpQuestion = {
    type: 'list',
    name: 'setUp',
    message: 'Would you like to make a new question, or edit an existing question?',
    choices: Object.keys(setUpVars).map((item) => setUpVars[item]), // Dynamically expands 'choices' based on keys from setUpVars object
};

/*************************************************************************
 * This function is in charge of executing the function associated with the
 * choice
 *************************************************************************/
const editQuestionsJSON = async (iAnswers) => {
    await setUpFunctions[iAnswers.setUp]();
    console.log('Process Complete!');
};

/*************************************************************************
 * Asks the user if they want to make further changes
 *************************************************************************/
const repeatProgram = async () => {
    var repeatProgram = {
        type: 'confirm',
        name: 'repeat',
        message: 'Would you like to run the program again?',
    }
    await inquirer.prompt(repeatProgram).then((answer) => {
        if (answer.repeat) {
            updateFile(); // Update the file here just in case the user ^C terminates the program after this point
            main();
        } else {
            exitProgram();
        }
    })
} 

/*************************************************************************
 * main
 *************************************************************************/
const main = async () => {
    await inquirer.prompt(setUpQuestion)
        .then(await editQuestionsJSON)
        .then(await repeatProgram)
        .catch(console.log);
};
main();
