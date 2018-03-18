/**
 * defaultQueries.test.js, contains tests for default queries.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

let chai            = require("chai");
let sinon           = require("sinon");
let sinonChai       = require("sinon-chai");
chai.use(sinonChai);
let expect          = chai.expect;

let ExpressSteroid  = require('../../index');


describe("Default Queries", function(){
    describe("#range", function(){
        it("Should return a range query, if all params are correct (Inclusive)", function(done){
            let es = new ExpressSteroid();

            let param = [10, 20];
            let dbFieldName = "yearsOfExperience";

            let expectedQuery = {};
            expectedQuery[dbFieldName] = {$gte: param[0], $lte: param[1]};

            //Call query.
            let result = es.queries.range(param, dbFieldName, true);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            done();
        });//End of it.
        it("Should return a range query, if all params are correct (Not inclusive)", function(done){
            let es = new ExpressSteroid();

            let param = [10, 20];
            let dbFieldName = "yearsOfExperience";

            let expectedQuery = {};
            expectedQuery[dbFieldName] = {$gt: param[0], $lt: param[1]};

            //Call query.
            let result = es.queries.range(param, dbFieldName, false);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            done();
        });//End of it.
        it("Should return an error, if the given param is not an array", function(done){
            let es = new ExpressSteroid();

            let param = "NOT AN ARRAY";
            let dbFieldName = "yearsOfExperience";

            let expectedQuery = new es.HTTPError(400, es.prefs.errMessages.queryBuilder.incorrectRange(param));

            //Call query.
            let result = es.queries.range.call(es, param, dbFieldName, true);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            done();
        });//End of it.
        it("Should return an error, if the given param is not a correct range", function(done){
            let es = new ExpressSteroid();

            let param = [1];
            let dbFieldName = "yearsOfExperience";

            let expectedQuery = new es.HTTPError(400, es.prefs.errMessages.queryBuilder.incorrectRange(param));

            //Call query.
            let result = es.queries.range.call(es, param, dbFieldName, true);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            done();
        });//End of it.
    });//End of #range.
    describe("#equality", function(){
        it("Should return an equality query", function(done){
            let es = new ExpressSteroid();

            let param = 15;
            let dbFieldName = "yearsOfExperience";

            //Expected query.
            let expectedQuery = {};
            expectedQuery[dbFieldName] = {$eq: param};

            //Call query.
            let result = es.queries.equality.call(es, param, dbFieldName);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            //Done.
            done();
        });//End of it.
    });//End of #equality.
    describe("#partialStringMatch", function(){
        it("Should return a regex query", function(done){
            let es = new ExpressSteroid();

            let param = "John D";
            let dbFieldName = "name";

            //Expected query.
            let expectedQuery = {};
            expectedQuery[dbFieldName] = {$regex: param};

            //Call query.
            let result = es.queries.partialStringMatch.call(es, param, dbFieldName);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            //Done.
            done();
        });//End of it.
    });//End of #partialStringMatch.
    describe("#inArray", function(){
        it("Should return an 'in' query", function(done){
            let es = new ExpressSteroid();

            let param = ["Employee", "Manager"];
            let dbFieldName = "role";

            //Expected query.
            let expectedQuery = {};
            expectedQuery[dbFieldName] = {$in: param};

            //Call query.
            let result = es.queries.inArray.call(es, param, dbFieldName);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            //Done.
            done();
        });//End of it.
    });//End of #inArray.
    describe("#sortBy", function(){
        it("Should return sort object given string", function(done){
            let es = new ExpressSteroid();

            let param = "createdAt,-ratings";

            //Expected query.
            let expectedQuery = {
                createdAt: 1,
                ratings: -1
            };

            //Call query.
            let result = es.queries.sortBy.call(es, param);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            //Done.
            done();
        });//End of it.
        //TODO: not an array, not a string, descending, ascending.
        it("Should return sort object given string", function(done){
            let es = new ExpressSteroid();

            let param = "-ratings";

            //Expected query.
            let expectedQuery = {
                ratings: -1
            };

            //Call query.
            let result = es.queries.sortBy.call(es, param);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            //Done.
            done();
        });//End of it.
        it("Should return sort object given an array", function(done){
            let es = new ExpressSteroid();

            let param = ["createdAt","-ratings"];

            //Expected query.
            let expectedQuery = {
                createdAt: 1,
                ratings: -1
            };

            //Call query.
            let result = es.queries.sortBy.call(es, param);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            //Done.
            done();
        });//End of it.
        it("Should return sort object given an array", function(done){
            let es = new ExpressSteroid();

            let param = ["ratings"];

            //Expected query.
            let expectedQuery = {
                ratings: 1
            };

            //Call query.
            let result = es.queries.sortBy.call(es, param);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            //Done.
            done();
        });//End of it.
        it("Should return an error if the passed is not a string or an array", function(done){
            let es = new ExpressSteroid();

            let param = 500;

            //Expected query.
            let expectedQuery = new es.HTTPError(400, es.prefs.errMessages.queryBuilder.paramNotCorrect(param));

            //Call query.
            let result = es.queries.sortBy.call(es, param);

            //Check the result.
            expect(result).to.deep.equal(expectedQuery);

            //Done.
            done();
        });//End of it.
    });//End of #sortBy.
});//End of Query Builder.