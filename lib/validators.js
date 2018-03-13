/**
 * validators.js, contains validators functions.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

const   HTTPError       = require('./helper').Error;
const   lodash          = require('lodash');

function isMember(value, prefs, next, array){
    //If found, pass correct.
    if(array && array.indexOf && array.indexOf(value) >= 0) return next();

    //Otherwise, fail.
    return next(new HTTPError(400, prefs.errMessages.validator.isMember(value, array)));
}//End of isMember.

function isSubset(value, prefs, next, array){
    //If the array is empty.
    if(!value || value && value.length === 0) {
        return next(new HTTPError(400, prefs.errMessages.validator.isSubset(value, array)));
    }
    //If the value is a subset of the array, pass.
    if(value.length === lodash.intersection(value, array).length) return next();

    //Otherwise, fail.
    return next(new HTTPError(400, prefs.errMessages.validator.isSubset(value, array)));
}//End of isSubset.

function isInRange(value, prefs, next, min, max, inclusive){
    let inRange = value > min && value < max;               //Assume it's not inclusive.
    if(inclusive) inRange = value >= min && value <= max;   //If it's, change it to inclusive.

    //If in range, pass null to next function, otherwise pass the error.
    return next(inRange? undefined: new HTTPError(400, prefs.errMessages.validator.isInRange(value, min, max, inclusive)));
}

function isOfType(value, prefs, next, type){
    //If the type is an array, check using array type checker.
    if(type === "array") return next(Array.isArray(value)? undefined: new HTTPError(400, prefs.errMessages.validator.isOfType(value, type)));
    //Otherwise, use typeof to check.
    return next(typeof value === type? undefined: new HTTPError(400, prefs.errMessages.validator.isOfType(value, type)));
}

/**
 * Exported functions.
 */
module.exports = {
    isMember            : isMember,
    isSubset            : isSubset,
    isInRange           : isInRange,
    isOfType            : isOfType
};//End of Exports.