#!/usr/bin/env node
'use strict';
/**
 * The cli that allows script to be run by node and npm
 * @module cli
 * @requires glob
 * @requires PATH
 */
const glob = require('glob');
const PATH = require('path');

/**
 * Passed arugment for directory to find source files.  
 * @constant INPUT_PATH
 */
const INPUT_PATH = process.argv[2];

/**
 * Resolved file system path
 * @constant ROOT_PATH
 */
const ROOT_PATH = PATH.resolve(INPUT_PATH);

// console.debug(
//     '\n __dirname: ', __dirname,
//     '\n process.cwd(): ', process.cwd(),
// );

console.info('Attempting to create documentation for source files located in: ', ROOT_PATH);

try {
    glob(`${ROOT_PATH}/**/*.js`, (err, files) => {
        if (err) throw err;
        if (!files || files.length === 0) {
            return console.info('create-docs:handleFiles: There are no source files to create documentation.')
        }
        const markdownDocumentationHelper = require('../');
        markdownDocumentationHelper.createDocsDirectory(`${ROOT_PATH}/docs`).then((confirmedPath) => {
            console.info('Created docs directory: ', confirmedPath);
            markdownDocumentationHelper.createReadmeFiles(ROOT_PATH, confirmedPath, files);
        });
    });
} catch(err) {
    console.error('Error: ', err)
}
