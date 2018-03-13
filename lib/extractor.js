/**
 * extractor.js, responsible for extracting parameters given by user from API.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

const   Error                   = require('./helper').Error;
const   parseMultiValues        = require('./helper').parseMultiValues;
const   getSchemaFields         = require('./helper').getSchemaFields;
const   lodash                  = require('lodash');

/**
 * Extracts the given parameters names from the given sources (Or default sources), but every param is required, if any are missing an error is returned to user.
 * Just a proxy to the function: extract.
 * @param {String|Array}            paramsNames         Parameters names, if string, they are separated by the extractor separator.
 * @param {Array}                   [sources]           Array of strings. Sources in req object to look for parameter's values in.
 * @returns {*}                                         Middleware.
 */
function requiredExtract(paramsNames, sources){
    return extract.call(this, paramsNames, true, sources);
}//End of requiredExtract.

/**
 * Extracts the given parameters names from the given sources (Or default sources), if required is passed then every param is required, if any are missing an error is returned to user.
 * Just a proxy to the function: extract.
 * @param {String|Array}            paramsNames         Parameters names, if string, they are separated by the extractor separator.
 * @param {Boolean}                 required            Whether or not the params are required.
 * @param {Array}                   [sources]           Array of strings. Sources in req object to look for parameter's values in.
 * @returns {*}                                         Middleware.
 */
function extract(paramsNames, required, sources){
    //Parameters.
    let params;
    
    //Make sure there are sources.
    sources = sources || this.prefs.extractor.sources || [];

    //Check for parameter's type, and parse if not string.
    params = parseMultiValues(paramsNames, this.prefs.extractor.separator);

    //Check for params.
    if(!params) throw new Error(400, this.prefs.errMessages.extractor.paramNotCorrect(paramsNames));

    //Return middleware.
    return function(req, res, next){
        //Call helper function, if the call didn't succeed (param is required and is not found),
        //an error is returned by the function itself.
        let succeeded = findAndSetValues.call(this, params, sources, required, req, next);

        //If the call succeeded, pass the function.
        if(succeeded) return next();
    }.bind(this);//End of middleware.
}//End of extract.

/**
 * Extracts parameters of given model name. If requiredAll is true, all fields of the model's schema must be present.
 * If checkRequired is true, all required fields of the model's schema must be present. If both are false then
 * all fields are optional.
 * @param {String}                      modelName           Model name is defined to mongoose.
 * @param {Boolean}                     [requiredAll]       Require all fields. false by default
 * @param {Boolean}                     [checkRequired]     Require only required fields in schema. false by default.
 * @param {Array}                       [ignoredFields]     Ignore those fields from extraction. Default = prefs.extractor.ignoredFields.
 * @param {Array}                       [sources]           Sources in req to look in, Default=prefs.extractor.sources.
 * @returns {function}                                      Middleware.
 */
function extractFromSchema(modelName, requiredAll, checkRequired, ignoredFields, sources){
    //Get the fields.
    let fields          = getSchemaFields(modelName, ignoredFields || this.prefs.extractor.ignoredFields);

    //Make sure there are sources.
    sources = sources || this.prefs.extractor.sources;

    //Return middleware.
    return function(req, res, next){
        //Pass if there are no fields.
        if(!fields) return next();

        //Call helper function, if the call didn't succeed (param is required and is not found),
        //an error is returned by the function itself.
        let succeeded;

        //Check required fields.
        succeeded = findAndSetValues.call(this, fields["required"], sources, (requiredAll || checkRequired), req, next);

        //Check optional fields.
        if(succeeded) succeeded = findAndSetValues.call(this, fields["optional"], sources, requiredAll, req, next);

        //If the second call succeeded, pass the function.
        if(succeeded) return next();
    }.bind(this);//End of middleware.
}//End of extractFromSchema.

/**
 * Finds the values of parameters in req.[each source of sources], if found they are set in req[pref.dataObjName].
 * @param {String|Array}            params              Parameters names, if string, they are separated by the extractor separator.
 * @param {Boolean}                 required            Whether or not the params are required.
 * @param {Array}                   [sources]           Array of strings. Sources in req object to look for parameter's values in.
 * @param {Object}                  req                 ExpressJs req Object.
 * @param {Function}                next                ExpressJs Next function.
 * @returns {boolean}                                   True iff all passed.
 */
function findAndSetValues(params, sources, required, req, next){
    //Parse in sources.
    let found;
    let value;

    //Loop for each param.
    for(let param of params) {
        found = false;

        //Loop for each source.
        for (let source of sources) {
            //Try to ge the param value
            value = lodash.get(req, source + "." + param);

            //Check if the param exists.
            if(value !== undefined) {
                //Set the found value to req[pref.dataObjName].
                lodash.set(req, this.prefs.dataObjName + "." + param, value);
                //Set to true.
                found = true;
                break;
            }
        }//End of sources loop.

        //If no values were found and they are required, return an error.
        if(!found && required) {
            next(new Error(400, this.prefs.errMessages.extractor.paramNotFound(param)));
            return false;
        }
    }//End of params loop.

    //Return true if everything passed.
    return true;
}//End of findAndSetValues.


/**
 * Exported functions.
 */
module.exports = {
    extract             : extract,
    requiredExtract     : requiredExtract,
    extractFromSchema   : extractFromSchema,
    findAndSetValues    : findAndSetValues
};//End of Exports.