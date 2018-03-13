/**
 * validator.js, responsible for validation mechanism. Validates input to the API.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';


const lodash                = require('lodash');
const HTTPError             = require('./helper').Error;
const parseMultiValues      = require('./helper').parseMultiValues;

/**
 * Validates a single parameter named paramName and found in req[pref.validator.sources] with given validator function.
 * @param {String}                  paramName           Target parameter name.
 * @param {Function}                validator           Validator function. Each has atleast 3 params:
 *                                                      value (Value to be validated), pref (Preferences object),
 *                                                      next (Express next function), and ...args, which are passed to
 *                                                      this function.
 * @param {...*}                    [args]              Arguments to be passed to the validator.
 * @returns {function(this:validate)}
 */
function validate(paramName, validator, ...args){
    //Get the sources.
    let sources = this.prefs.validator.sources;

    //Ensure validator is a function.
    if(typeof validator !== "function") throw new Error(this.prefs.errMessages.validator.validatorIsNotFunction(validator));

    //Return middleware.
    return function(req, res, next){
        //Temp vars.
        let value, source, found = false;
        //Find in sources.
        for(source of sources){
            //Get the value.
            value = lodash.get(req, source + "." + paramName);
            //If value is found.
            if(value !== undefined){
                //Set the Value is found.
                found = true;
                //Call the validator.
                validator.call(this, value, this.prefs, next, ...args);
                break;
            }
        }//End of sources loop.

        //Pass if not found.
        if(!found) return next();
    }.bind(this);//End of middleware.
}//End of validate.


/**
 * Validates all parameters named paramsName and found in req[pref.validator.sources] with given validator function.
 * ParamsNames are either an array of strings, or are a string separated by pref.validator.separator.
 * @param {String|Array}            paramsNames         Target parameters names.
 * @param {Function}                validator           Validator function. Each has atleast 3 params:
 *                                                      value (Value to be validated), pref (Preferences object),
 *                                                      next (Express next function), and ...args, which are passed to
 *                                                      this function.
 * @param {...*}                    [args]              Arguments to be passed to the validator.
 */
function validateAll(paramsNames, validator, ...args){
    //Get the sources.
    let sources = this.prefs.validator.sources;

    //Ensure validator is a function.
    if(typeof validator !== "function") throw new Error(this.prefs.errMessages.validator.validatorIsNotFunction(validator));

    //Get the params.
    paramsNames = parseMultiValues(paramsNames, this.prefs.validator.separator);

    //Return middleware.
    return function(req, res, next){
        return validateCurrent(this.prefs, sources, paramsNames, 0, req, next, validator, ...args);
    }.bind(this);//End of middleware.
}//End of validateAll.


/**
 * A helper function that iterates all params recursively, if one is found, it's validated using the given validator,
 * if all passes, the middleware is passed, other wise an error is returned to it.
 * @param {Object}                  prefs       Preferences object.
 * @param {Array}                   sources     Sources in req object to look for parameter's values in.
 * @param {Array}                   params      Array of params names to be validated.
 * @param {Number}                  index       Current index of param to be validated, start with zero, used for
 *                                              ase case of recursion.
 * @param {Object}                  req         ExpressJs req object.
 * @param {Function}                next        ExpressJs next function.
 * @param {Function}                validator   Validator function.
 * @param {...*}                    [args]      Arguments passed to validator.
 * @returns {*}
 */
function validateCurrent(prefs, sources, params, index, req, next, validator, ...args){
    //Base case, if all parameters passed, pass to next.
    if(index >= params.length) return next();

    //Temp vars.
    let value, source, found = false;
    //Find in sources.
    for(source of sources){
        value = lodash.get(req, source + "." + params[index]);

        //If value is found.
        if(value !== undefined){
            //Value is found.
            found = true;
            //Call the validator.
            validator.call(this, value, prefs, function(err){
                if(err) return next(err);
                return validateCurrent(prefs, sources, params, index+1, req, next, validator, ...args);
            }, ...args);
            break;
        }
    }//End of sources loop.

    //Pass if not found.
    if(!found) return validateCurrent(prefs, sources, params, index+1, req, next, validator, ...args);
}//End of validateCurrent.







/**
 * Exported functions.
 */
module.exports = {
    validate            : validate,
    validateAll         : validateAll
};//End of Exports.