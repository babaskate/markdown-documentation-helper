'use strict';
/**
 * @module markdown-documentation-helper
 * @requires fs
 * @requires jsdoc2md
 * @requires PATH
 */
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
const PATH = require('path');

/**
 * @alias module:markdown-documentation-helper
 * @typicalname MarkdownDocumentationHelper
 */
class MarkdownDocumentationHelper {
    /**
     * Create the docs directory on the file sysyem if it doesn't exist otherwise
     * resolve the Promise with the existing location
     * @method createDocsDirectory
     * @param {String} docsPath 
     * @returns {Promise} Resolves with the confirmed path to the docs directory.
     */
    createDocsDirectory(docsPath) {
        return new Promise((resolve) => {
            fs.exists(docsPath, (exists) => {
                if(!exists) {
                    fs.mkdir(
                        docsPath,
                        {
                            recursive: true
                        },
                        (err) => {
                            resolve(docsPath);
                            if (err) throw err;
                    });
                } else {
                    resolve(docsPath);
                }
            });
        });
    }

    /**
     * Handle jsdoc2md resolved promise with buffered data 
     * @method handleRender
     * @param {String} fileName Filename of written file.
     * @param {String} buffer Data to be written
     */
    handleRender(fileName, buffer) {
        fs.writeFile(fileName, buffer, (err) => {
            if (err) throw err;
            console.info(`${fileName} created`)
        });
    }

    /**
     * @method renderReadme Renders the file from jsDoc to Markdown and writes it to a file.  
     * @param {String} filePath Path to file
     * @param {String} readMeFileName the filename of the generated Markdown file.
     */
    renderReadme(filePath, readMeFileName) {
        jsdoc2md.render({files: filePath}).then((fulfil) => {
            if (fulfil) {
                this.handleRender(readMeFileName, fulfil);
            }
        });
    }

    /**
     * For each file, parse its path, check if the directory it resides in exists, then attempt 
     * to render it.
     * @method createReadmeFiles
     * @param {Array} files Array of files returned from glob
     */
    createReadmeFiles(rootPath, docsPath, files) {
        files.forEach((file) => {
            const parsedPath = PATH.parse(file.substring(rootPath.length));
            const newDocPath = `${docsPath}${parsedPath.dir}`;
            const readMeFileName = `${newDocPath}/${parsedPath.base.replace('.js', '.md')}`;
            fs.exists(newDocPath, (dirExists) => {
                if (!dirExists) {
                    fs.mkdir(
                        newDocPath,
                        {
                            recursive: true
                        },
                        (err) => {
                            this.renderReadme(file, readMeFileName);
                            if (err) console.info(err);;
                            // if (err) throw err;
                        }
                    );
                } else {
                    this.renderReadme(file, readMeFileName);
                }
            });
        });
    }
}

module.exports = new MarkdownDocumentationHelper();