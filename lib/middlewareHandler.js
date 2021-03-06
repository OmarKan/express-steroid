/**
 * middlewareHandler.js, responsible for injection mechanism, middleware functions manipulation, and response handling.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

const   getArgs             = require('./helper').getArgs;
const   HTTPError           = require('./helper').Error;
const   lodash              = require('lodash');



/**
 * Injects parameters values into a function. The values are are found in req object inside objects named in sources.
 * Not to be used independently from ExpressSteroid Object.
 * @param {Function}                func            Function to be injected.
 * @param {Boolean}                 pass            Whether or not to pass to the next function.
 * @param {Array}                   [sources]       Sources in req object to look for parameter's values in. Default= prefs.middlewareHandler.sources.
 * @param {Object}                  [defaults]      Key: argumentName, value: Default value in case the parameter was not found in any of the sources.
 * @returns {Function}                              Middleware.
 */
let inject = function(func, pass, sources, defaults){
    //Check if the passed is a function.
    if(typeof func !== 'function') throw new Error(this.prefs.errMessages.middlewareHandler.paramNotFunction(func));

    //Assign default sources.
    sources = sources || this.prefs.middlewareHandler.sources;

    //Assign defaults.
    defaults = defaults || {};

    //Obtain the arguments.
    let args = getArgs(func);

    //Return middleware.
    return function(req, res, next){
        //Params of the function.
        let params = getParametersArray(args, sources, defaults, req, res, next, pass, this.prefs);

        //Call the function.
        func.apply(this, params);
    }.bind(this);
};//End of middlewareHandler.

/**
 * Assigns parameters their values.
 * @param {Object}                  args            Arguments names (in the injected function).
 * @param {Array}                   sources         Sources in req object to look for parameter's values in.
 * @param {Object}                  defaults        Key: argumentName, value: Default value in case the parameter was not found in any of the sources.
 * @param {Object}                  req             Express req Object.
 * @param {Object}                  res             Express res Object.
 * @param {Function}                next            Express next function.
 * @param {Boolean}                 pass            Whether or not to pass to the next function.
 * @param {Object}                  prefs           Express Steroid Preferences object.
 * @returns {Array}                                 Array of parameters values to call the injected function with.
 */
function getParametersArray(args, sources, defaults, req, res, next, pass, prefs){
    let parameters = [];    //Returned parameters array.
    let value;              //Temp to hold values.
    let defaultInjections = prefs.middlewareHandler.defaultInjection;

    //Loop for each argument.
    for (let i = 0 ; i < args.length ; i++){
        //Check if variable requires a handler.
        if(prefs.resultHandlers && prefs.resultHandlers[args[i]]){
            //If so, middlewareHandler the handler after providing appropriate parameters.
            parameters.push(prefs.resultHandlers[args[i]](req, res, next, pass, prefs));
        }

        //Default injection.
        else if(args[i] === "req" && defaultInjections.indexOf("req") >= 0)    parameters.push(req);
        else if(args[i] === "res" && defaultInjections.indexOf("res") >= 0)    parameters.push(res);
        else if(args[i] === "next" && defaultInjections.indexOf("next") >= 0)  parameters.push(next);
        else if(args[i] === "user" && defaultInjections.indexOf("user") >= 0)  parameters.push(req.user);

        //Otherwise, try to get the parameter value.
        else {
            //Loop for each of the sources.
            for(let source of sources){
                //Get the value from the source.
                value = lodash.get(req, source + "." + args[i]);

                if(!value && source === args[i]) value = req[args[i]];
                //If found, break.
                if(value !== undefined) break;
            }

            //Add the parameter, if value not found look in defaults.
            parameters.push(value !== undefined? value: defaults[args[i]]);
        }
    }

    return parameters;
}//End of getParameters.

/**
 * Default handler, sends response with given status. Doesn't call next.
 * @returns {Function}      Function used by the programmer in service functions to send responses.
 */
function respond(_, res, next, pass, __){
    return function(err, response, status){
        if(err) return next(err);

        //Return result.
        res.status(status || 200).send(response);

        if(pass) return next();
    }
}//End of respond

/**
 * Returns 404 if the response is empty, otherwise returns the response with 200.
 * @returns {Function}          Function used by the programmer in service functions to send responses.
 */
function handleResult(_, res, next, pass, prefs){
    return function(err, response){
        if(err) return next(err);
        else if(response === null || response === undefined) return next(new HTTPError(404, prefs.errMessages.middlewareHandler.notFound()));

        //Return result.
        res.status(200).json(response);

        if(pass) return next();
    }
}//End of handleResult.

/**
 * Default handler, stores the result of the current service function in req[prefs.resultsObjName]. To be used in next
 * Function.
 * @returns {Function}  Function used by the programmer in service functions to call next.
 */
function passToNext(req, _, next, __, prefs){
    return function(err, response){
        //Handle error.
        if(err) return next(err);

        //Save the response.
        req[prefs.resultsObjName] = lodash.assign(req[prefs.resultsObjName] || {}, response);

        //Pass to next.
        return next();
    }
}//End of passToNext.

/**
 * Exported functions.
 */
module.exports = {
    inject              : inject,
    resultHandlers      : {
        passToNext          : passToNext,
        respond             : respond,
        handleResult        : handleResult
    }
};//End of Exports.