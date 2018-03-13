/**
 * validator.test.js, contains tests for queryBuilder module.
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



describe("Validator", function(){
    describe("#validate", function(){
        it("Should validate a parameter using a given function", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                data: {
                    key1: "value1",
                    key2: [1,2,3],
                    key3: 500
                },
                params: {
                    key4: {
                        test: "value2"
                    }
                }
            };

            //Mock extra values.
            let e1 = "EXTRA_VALUE";
            let e2 = {
                key1: "VALUE",
                key2: [1,2,"VALUE"]
            };

            //Mock next.
            let nextFunc = function(){
                done();
            };//End of next.

            //Mock validator.
            let validator = function(value, prefs, next, extra1, extra2){
                expect(value).to.equal(req.data.key1);
                expect(extra1).to.equal(e1);
                expect(extra2).to.deep.equal(e2);

                next();
            };

            //Call the function.
            es.validate.call(es, "key1", validator, e1, e2)(req, null, nextFunc);
        });//End of it.
        it("Should not validate a non-existing parameter using a given function, with different sources", function(done){
            let es = new ExpressSteroid({validator: {sources: ["params"]}});

            //Mock req.
            let req = {
                data: {
                    key1: "value1",
                    key2: [1,2,3],
                    key3: 500
                },
                params: {
                    key4: {
                        test: "value2"
                    }
                }
            };



            //Mock validator.
            let validator = function(value, prefs, next){
                console.log(value);
                console.log(req.data);
                expect(value).to.equal(req.data.key1);

                next();
            };

            //Spy on validator.
            let spy = sinon.spy(validator);

            //Mock next.
            let nextFunc = function(){
                expect(spy).to.have.callCount(0);

                done();
            };//End of next.

            //Call the function.
            es.validate.call(es, "key1", spy)(req, null, nextFunc);
        });//End of it.
        it("Should validate a parameter using a given function, with different sources", function(done){
            let es = new ExpressSteroid({validator: {sources: ["params"]}});

            //Mock req.
            let req = {
                data: {
                    key1: "value1",
                    key2: [1,2,3],
                    key3: 500
                },
                params: {
                    key4: {
                        test: "value2"
                    }
                }
            };



            //Mock validator.
            let validator = function(value, prefs, next){
                expect(value).to.deep.equal(req.params.key4);

                next();
            };

            //Spy on validator.
            let spy = sinon.spy(validator);

            //Mock next.
            let nextFunc = function(){
                expect(spy).to.have.callCount(1);

                done();
            };//End of next.

            //Call the function.
            es.validate.call(es, "key4", spy)(req, null, nextFunc);
        });//End of it.
        it("Should not validate a parameter if given validator is not a function", function(done){
            let es = new ExpressSteroid({validator: {sources: ["params"]}});

            //Mock req.
            let req = {
                data: {
                    key1: "value1",
                    key2: [1,2,3],
                    key3: 500
                },
                params: {
                    key4: {
                        test: "value2"
                    }
                }
            };



            //Mock validator.
            let validator = "NOT A FUNCTION";


            //Call the function.
            try{
                es.validate.call(es, "key4", validator)(req, null, null);
            }
            catch(error){
                expect(error.message).to.deep.equal(es.prefs.errMessages.validator.validatorIsNotFunction(validator));

                done();
            }
        });//End of it.
    });//End of #validate.
});//End of describe Validator.