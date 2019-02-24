/**
 * helper.js Contains helper methods used in the library.
 * Omar Kanawati.
 * Express Steroid, 2018.
 */

'use strict';

const   mongoose                = require('mongoose');
const   lodash                  = require('lodash');

/**
 * Extracts fields names from model with given modelName. Ignores any fields in ignoredFields.
 * The result is an object with two elements: "required", "optional", each has an array of fields names.
 * @param {Object}                  model               Mongoose model object.
 * @param {Array}                   [ignoredFields]     Ignored fields.
 * @returns {Object|undefined}                          Returned object if model exists, undefined otherwise.
 */
function getSchemaFields(model, ignoredFields){
    //Ensure there're ignoredFields.
    ignoredFields = ignoredFields || [];

    //Try to get the fields.
    let fields = lodash.get(model, "schema.paths");

    //Return undefined if the fields are not found.
    if(!fields) return undefined;

    //Results object.
    let results = {required: [], optional: []};

    //Loop for all fields.
    lodash.forEach(fields, function(field, key){
        if(ignoredFields.indexOf(key) < 0){
            if(field.isRequired)    results.required.push(key);
            else                    results.optional.push(key);
        }
    });

    //Return results.
    return results;
}//End of getSchemaFields.


/**
 * Returns the arguments names of the function.
 * @param {Function}            func        Target function.
 * @returns {Array}                         Array of strings.
 */
function getArgs(func) {
    return (func + '')
        .replace(/[/][/].*$/mg,'') // strip single-line comments
        .replace(/\s+/g, '') // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
        .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
        .replace(/=[^,]+/g, '') // strip any ES6 defaults
        .split(',').filter(Boolean); // split & filter [""]
}//End of getArgs.

/**
 * Function that takes an input of string or array, and if it's a string of separated values, it converts it into an array of those values.
 * @param {String|Array}            input           Target input.
 * @param {String}                  separator       Separator if the input is a string.
 * @returns {Array|null}                            Returns an array if the input is a string or an array, otherwise it returns null.
 */
function parseMultiValues(input, separator){
    //Check parameters.
    if(typeof input === "string") return input.split(separator);
    else if(Array.isArray(input)) return input;
}//End of parseMultiValues.

/**
 * Defines an error.
 * @param {Number|String}           code        Status code.
 * @param {String|Object}           message     Error message.
 * @returns {Error}
 * @constructor
 */
function Error(code, message){
    this.status = code;
    this.message = message;

    return this;
}//End of Error.

/**
 * Error handling middleware.
 */
function errorHandler(err, req, res, next){
    res.status(err.status ||  err.errorCode || 500);
    return res.send({
        message: err.message
    });
}

/**
 * Export the variables.
 */
module.exports = {
    getArgs             : getArgs,
    Error               : Error,
    errorHandler        : errorHandler,
    parseMultiValues    : parseMultiValues,
    getSchemaFields     : getSchemaFields
};