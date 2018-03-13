/**
 * queryBuilder.js, responsible for building queries.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

const   lodash              = require('lodash');
const   HTTPError           = require('./helper').Error;

/**
 * General function that builds a given query with given param name.
 * @param {String}      paramName               Parameter name, which is input to the API. The value
 *                                              of the parameter is got from prefs.queryBuilder.sources.
 *                                                                  If not found, no query will be built.
 * @param {String}      resultFieldName         Store the query in req[prefs.queryBuilder.queriesObjName][resultFieldName].
 * @param {Function}                        query                   Query function, takes as argument:
 *                                                                  parameterValue, dbFieldName, ...queryArgs.
 * @param {String}                          [dbFieldName]           Name of the field in the database, to perform query on.
 * @param {...*}                            [queryArgs]             Additional arguments to be passed to the query function.
 * @returns {function}                                              Middleware.
 */
function buildQuery(paramName, resultFieldName, query, dbFieldName, ...queryArgs){
    //Get sources.
    let sources = this.prefs.queryBuilder.sources;
    let builtQuery;

    //Return the middleware.
    return function(req, _, next){
        //Temp values.
        let value, source;

        //Loop for all sources.
        for (source of sources){
            //Try to get the value.
            value = lodash.get(req, source + "." + paramName);

            //If value is found.
            if(value !== undefined){
                //Call the query.
                builtQuery = query.call(this, value, dbFieldName, ...queryArgs);

                //Set the value, only if query exists.
                if(! (builtQuery instanceof HTTPError)) {
                    if(!req[this.prefs.queryBuilder.queriesObjName]) req[this.prefs.queryBuilder.queriesObjName] = {};
                    if(!req[this.prefs.queryBuilder.queriesObjName][resultFieldName]) req[this.prefs.queryBuilder.queriesObjName][resultFieldName] = {};

                    lodash.merge(req[this.prefs.queryBuilder.queriesObjName][resultFieldName], builtQuery);

                }
                else return next(builtQuery);

                //Done searching.
                break;
            }
        }//End of sources loop.

        //Return next.
        return next();
    }.bind(this);//End of middleware.
}//End of queryBuilder.




/**
 * Exported functions.
 */
module.exports = {
    buildQuery          : buildQuery
};//End of Exports.