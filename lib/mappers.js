/**
 * mappers.js, contains mapper functions that are used with parsers.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

const   ObjectId            = require('mongoose').Types.ObjectId;



exports.objectIdMapper = function(value){
    if(ObjectId.isValid(value)) return new ObjectId(value);
};

exports.dateMapper = function(value){
    return new Date(value);
};

exports.intMapper = function(value){
    return parseInt(value);
};

exports.floatMapper = function(value){
    return parseFloat(value);
};

exports.stringToArrayMapper = function(separator){
    return function(value){
        return typeof value === "string"? value.split(separator): undefined;
    };
};



