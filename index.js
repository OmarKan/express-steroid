/**
 * index.js Instantiates and loads the library modules.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

"use strict";

const   middlewareHandler   = require('./lib/middlewareHandler');
const   extractor           = require('./lib/extractor');
const   manipulator         = require('./lib/manipulator');
const   mappers             = require('./lib/mappers');
const   validator           = require('./lib/validator');
const   validators          = require('./lib/validators');
const   queryBuilder        = require('./lib/queryBuilder');
const   defaultQueries      = require('./lib/queries');
const   errorHandler        = require('./lib/helper').errorHandler;
const   HTTPError           = require('./lib/helper').Error;
const   lodash              = require('lodash');

let dataObjName = "data", resultsObjName = "results", queryObjName = "queries";

//Default preferences.
let defaultPrefs = {
    resultsObjName      : "results",
    dataObjName         : dataObjName,
    resultHandlers      :  middlewareHandler.resultHandlers,
    middlewareHandler   : {
        sources     : [dataObjName, resultsObjName, queryObjName],
        defaultInjection: ["user", "req", "res", "next"]
    },
    extractor           : {
        separator   : " ",
        sources     : ["body", "query", "params"],
        ignoredFields: ["_id", "__v"]
    },
    manipulator         : {
        sources     : [dataObjName]
    },
    validator           : {
        sources     : [dataObjName],
        separator   : " "
    },
    queryBuilder    : {
        sources     : [dataObjName],
        queriesObjName: queryObjName
    },
    errMessages         : {
        middlewareHandler      : {
            paramNotFunction: function(param){
                return "Argument passed: " + param  + " is not a function";
            }
        },
        extractor   : {
            paramNotCorrect: function(param) {
                return "Passed params: " + param + " are not of correct type";
            },
            paramNotFound  : function(param){
                return "Param: " + param  + " not found anywhere"
            }
        },
        manipulator : {
            paramNotCorrect: function(param){
                return "Param: " + param + " is not of correct type";
            }
        },
        validator   : {
            paramNotCorrect : function(param){
                return "Param: " + param + " is not of correct type";
            },
            validatorIsNotFunction  : function(param){
                return "Validator: " + param + " is not a function";
            },
            isMember                : function(param, array){
                return "Param: " + param + " is not a member of the array: " + array;
            },
            isSubset                : function(param, array){
                return "Param: " + param + " is not a subset of the array: " + array;
            },
            isInRange                 : function(param, min, max, inclusive){
                let rightBracket = inclusive? "[": "(";
                let leftBracket = inclusive? "]": ")";
                return "Param: " + param + " is not in range: " + rightBracket + min + "," + max + leftBracket;
            },
            isOfType                 : function(param, type){
                return "Param: " + param + " is not of type: " + type;
            }
        },
        queryBuilder    : {
            paramNotCorrect : function(param){
                return "Param: " + param + " is not of correct type";
            },
            incorrectRange  : function(param){
                return "Param: " + param + " must be an array with exactly two elements";
            }
        }
    }
};

/**
 * Main class.
 * @type {module.ExpressSteroid}
 */
module.exports = class ExpressSteroid{
    /**
     * Class constructor.
     * @param {Object}          [prefs]                     Override default preferences.
     * @param {String}          [prefs.resultsObjName]      Name of the object in req that saves the results when passing between middleware.
     * @param {String}          [prefs.dataObjName]         Name of the object in req that contains data passed from API.
     * @param {Object}          [prefs.resultHandlers]      Contains result handlers, each is an object with key: result handler parameter name, value: function.
     *                                                      Each result handler function has 4 params: req, res, next, prefs. and returns a function
     *                                                      with as many parameters as developer needs. the returned function will be called by the service user.
     *                                                      To have better understanding: check the example.
     * @param {Array}           [queries]                   User defined queries.
     */
    constructor(prefs, queries){
        //Ensure there are preferences.
        prefs = prefs || {};

        //Merge default preferences with given ones.
        this.prefs = lodash.defaultsDeep({}, prefs, defaultPrefs);

        //Injector.
        this.inject = middlewareHandler.inject;

        //Extractor.
        this.extract = extractor.extract;
        this.requiredExtract = extractor.requiredExtract;
        this.extractFromSchema = extractor.extractFromSchema;
        this.findAndSetValues = extractor.findAndSetValues;

        //Error handler.
        this.errorHandler = errorHandler;
        this.HTTPError    = HTTPError;

        //Manipulator.
        this.parse   = manipulator.parse;
        this.mappers = mappers;

        //Validator.
        this.validate       = validator.validate;
        this.validateAll    = validator.validateAll;
        this.validators     = validators;

        //Query builder.
        this.buildQuery     = queryBuilder.buildQuery;
        this.queries        = lodash.defaultsDeep({}, queries, defaultQueries);
    }
};//End of ExpressSteroid.