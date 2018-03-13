/**
 * queries.js, contains queries creator functions.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

const   HTTPError               = require('./helper').Error;
const   lodash                  = require('lodash');

/**
 * Creates a range query. Where the dbFieldName should be between the given range in the param.
 * @param {Array}                   param           Range, must be an array with exactly two values [min, max].
 * @param {String}                  dbFieldName     Name of the field in the database.
 * @param {Boolean}                 inclusive       Whether the range is inclusive or not.
 * @returns {*}
 */
function range(param, dbFieldName, inclusive){
    //Check the array length, must have only two values.
    if(!Array.isArray(param) || param.length !== 2){
        return new HTTPError(400, this.prefs.errMessages.queryBuilder.incorrectRange(param));
    }

    let greaterThan = inclusive? "$gte": "$gt";
    let lessThan    = inclusive? "$lte": "$lt";

    //Build the query.
    let query = {};
    query[dbFieldName] = {};
    query[dbFieldName][greaterThan] = param[0];    //First, greater than.
    query[dbFieldName][lessThan]    = param[1];    //Second, less than.
    return query;
}//End of range.

/**
 * Creates an equality query. Where the dbFieldName must be equal to the value of the param.
 * @param {*}                   param           Parameter to compare.
 * @param {String}              dbFieldName     Name of the field in the database.
 * @returns {Object}                            equality query.
 */
function equality(param, dbFieldName){
    //Build the query.
    let query = {};
    query[dbFieldName] = {};
    query[dbFieldName]["$eq"] = param;

    return query;
}//End of equality.


/**
 * Creates a partial string match query using $regex.
 * @param {String}              param                       Target param name.
 * @param {String}              dbFieldName                 DB field name to match with..
 * @returns {Object}                                        Query.
 */
function partialStringMatch(param, dbFieldName){
    //Build the query.
    let query = {};
    query[dbFieldName] = {};
    query[dbFieldName]["$regex"] = param;

    return query;
}//End of partialStringMatch.


/**
 * Create a sort query for fields with given paramName (Search in req[pref.queryBuilder.sources]),
 * and store the query in req[pref.queryBuilder.queriesObjName][resultFieldName]
 * @param {String|Array}            param                   Target parameter name.
 * @returns {Object}                                        Query.
 */
function sortBy(param){
    //Sorting object (Query).
    let sorting = {};

    //If param is a string, convert to array.
    if(typeof param === "string") param = param.split(",");

    //If param is an array.
    if(Array.isArray(param)){
        //Loop for each param, and build the query.
        lodash.forEach(param, function(sortField){
            if(sortField[0] === '-') sorting[sortField.substr(1)] = -1; //Ascending.
            else sorting[sortField] = 1;                                //Descending.
        });
    }
    //If not a string, or not an array, return an error.
    else return new HTTPError(400, this.prefs.errMessages.queryBuilder.paramNotCorrect(param));

    //Set the sorting field.
    return sorting;
}//End of sortBy.



/**
 * Exported functions.
 */
module.exports = {
    sortBy                  : sortBy,
    partialStringMatch      : partialStringMatch,
    range                   : range,
    equality                : equality
};//End of Exports.