#!/usr/bin/env node
// Above line is required for npm to make a symlink to this file to run in the command line
// See https://docs.npmjs.com/files/package.json#bin for details
const path = require('path');
const runCLI = require(path.join(__dirname, 'runCLI.js'));

(async function () {
    console.log('Please wait...');
    console.log( await runCLI() );
    console.log('finished!');
})();
