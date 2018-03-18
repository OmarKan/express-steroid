/**
 * manipulator.js, responsible for manipulation of input to the API.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

const lodash                 = require('lodash');
const HTTPError              = require('./helper').Error;
const parseMultiValues       = require('./helper').parseMultiValues;

/**
 * General middleware used to parse values (If found) in req.sources. If not found, nothing happens.
 * @param {Array}               params          Array of params names.
 * @param {Function}            mapper          Mapper function used to parse parameters.
 * @param {Array}               sources         Array of strings, names of objects in req, to look for values of params.
 * @returns {function}                          Middleware function.
 */
function parsingMiddleware(params, mapper, sources){
    //Check if params are of type array..
    if(!Array.isArray(params)) throw new Error(this.prefs.errMessages.manipulator.paramNotCorrect(params));
    //Check if mapper is a function.
    if(typeof mapper !== "function") throw new Error(this.prefs.errMessages.manipulator.paramNotCorrect(mapper));

    return function(req, res, next){
        //Temp value.
        let value;
        //Loop for all parameters.
        for(let param of params){
            //Loop for all sources.
            for(let source of sources){
                //Try to get the value in source.
                value = lodash.get(req, source + "." + param);
                //If found.
                if(value !== undefined){
                    //If it's an array, parse all value in array.
                    if(Array.isArray(value))    value = lodash.map(value, mapper);
                    //If it's a single value, parse that value.
                    else                        value = mapper(value);
                    //Set the value in req[prefs.dataObjName].
                    lodash.set(req, this.prefs.dataObjName + "." + param, value);
                }
            }//End of sources loop.
        }//End of parameters loop.

        //Pass to next.
        return next();
    }.bind(this);//End of middleware.
}//End of parsingMiddleware.


/**
 * General Parser function.Takes a parameters names array, finds each one of the values in sources. if found, parses
 * each of the value using the given mapper. The separator is used to parse the names of the parameters array if's a string.
 * @param {Array|String}                paramsNames         Parameters names. Can be an array or a string of values separated with a separator.
 * @param {Function}                    mapper              Function that maps individual values. (x)=>{return y}
 * @param {String}                      [separator]         Separator between names of parameters, if passed as
 * @param sources
 * @returns {*}
 */
function parse(paramsNames, mapper, separator, sources){
    let params = parseMultiValues(paramsNames, separator);

    //Ensure there are sources.
    sources = sources || this.prefs.manipulator.sources;

    //Return a middleware.
    return parsingMiddleware.call(this, params, mapper, sources);
}//End of parse.


/**
 * Exported functions.
 */
module.exports = {
    parse              : parse
};//End of Exports.