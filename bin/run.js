#!/usr/bin/env node
// Above line is required for npm to make a symlink to this file to run in the command line
// See https://docs.npmjs.com/files/package.json#bin for details
/*************************************************************************
 * Requires and Variables
 *************************************************************************/
const fs = require('fs');
const inquirer = require('inquirer');
var promptsFile = fs.readdirSync();
var promptsJSON = JSON.parse(promptsFile);
console.log('It\'s working!');

