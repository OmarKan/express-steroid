/**
 * queryBuilder.test.js, contains tests for queryBuilder module.
 * Omar Kanawati.
 * ExpressSteroid, 2018.
 */

'use strict';

let chai            = require("chai");
let sinon           = require("sinon");
let sinonChai       = require("sinon-chai");
chai.use(sinonChai);
let expect          = chai.expect;

let ExpressSteroid  = require('../index');


describe("Query Builder", function(){
    describe("#buildQuery", function(){
        it("Should build a query for correct params", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                data: {
                    "key1": "value1",
                    "key2": [10, 20],
                    "key3": 50,
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock res
            let res = "RES";

            //Mock next1.
            let next1 = function(err){
                //Ensure error doesn't exist.
                expect(err).to.be.undefined;

                //Ensure query is built and returned.
                expect(req[es.prefs.queryBuilder.queriesObjName]["filters"]).to.deep.equal({
                    key1: {$eq: "value1"}
                });
            };

            //Mock next2.
            let next2 = function(err){
                //Ensure error doesn't exist.
                expect(err).to.be.undefined;

                //Ensure query is built and returned.
                expect(req[es.prefs.queryBuilder.queriesObjName]["filters"]).to.deep.equal({
                    key1: {$eq: "value1"},
                    key2: {$eq: [10, 20]}
                });

                done();
            };

            //Mock extra params.
            let extra1 = "EXTRA PARAM";
            let extra2 = ["1", "2", 3];

            //Mock query function.
            let query = function(value, dbFieldName, extraParam1, extraParam2){
                //Ensure extra parameters are passed.
                expect(extraParam1).to.equal(extra1);
                expect(extraParam2).to.deep.equal(extra2);

                //Build and return query.
                let temp = {};
                temp[dbFieldName] = {};
                temp[dbFieldName] = {$eq: value};
                return temp;
            };//End of query.

            //Call the function.
            es.buildQuery("key1", "filters", query, "key1", extra1, extra2)(req, res, next1);
            es.buildQuery("key2", "filters", query, "key2", extra1, extra2)(req, res, next2);
        });//End of it.
        it("Should skip building a query for non-existing params (Using different sources)", function(done){
            let es = new ExpressSteroid({queryBuilder: {sources: ["params"]}});

            //Mock req.
            let req = {
                data: {
                    "key1": "value1",
                    "key2": [10, 20],
                    "key3": 50,
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock res
            let res = "RES";

            //Mock next1.
            let next1 = function(err){
                //Ensure error doesn't exist.
                expect(err).to.be.undefined;

                //Ensure query is built and returned.
                expect(req[es.prefs.queryBuilder.queriesObjName]).to.be.undefined;
            };

            //Mock next2.
            let next2 = function(err){
                //Ensure error doesn't exist.
                expect(err).to.be.undefined;

                //Ensure query is built and returned.
                expect(req[es.prefs.queryBuilder.queriesObjName]["filters"]).to.deep.equal({
                    key4: {$eq: req.params.key4}
                });

                done();
            };

            //Mock extra params.
            let extra1 = "EXTRA PARAM";
            let extra2 = ["1", "2", 3];

            //Mock query function.
            let query = function(value, dbFieldName, extraParam1, extraParam2){
                //Ensure extra parameters are passed.
                expect(extraParam1).to.equal(extra1);
                expect(extraParam2).to.deep.equal(extra2);

                //Build and return query.
                let temp = {};
                temp[dbFieldName] = {};
                temp[dbFieldName] = {$eq: value};
                return temp;
            };//End of query.

            //Call the function.
            es.buildQuery("key1", "filters", query, "key1", extra1, extra2)(req, res, next1);
            es.buildQuery("key4", "filters", query, "key4", extra1, extra2)(req, res, next2);
        });//End of it.
    });//End of #buildQuery.
});//End of Query Builder.