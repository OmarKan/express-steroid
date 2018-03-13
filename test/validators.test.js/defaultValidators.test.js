/**
 * defaultValidators.test.js, contains tests for default validators.
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



describe("Default Validators", function(){
    describe("#isMember", function(){
        it("Should pass if the value is member of given array", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = "A";
            let array = ["A", "B", "C"];

            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isMember(value, es.prefs, nextFunc, array);
        });//End of it.
        it("Should not pass if the value is not member of given array", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = "D";
            let array = ["A", "B", "C"];

            //Mock error.
            let error = new es.HTTPError(400, es.prefs.errMessages.validator.isMember(value, array));

            //Mock next.
            let nextFunc = function(err){
                expect(err).to.deep.equal(error);

                done();
            };

            //Call function.
            es.validators.isMember(value, es.prefs, nextFunc, array);
        });//End of it.
        it("Should not pass if the array is not of type Array.", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = "D";
            let array = "NOT AN ARRAY";

            //Mock error.
            let error = new es.HTTPError(400, es.prefs.errMessages.validator.isMember(value, array));

            //Mock next.
            let nextFunc = function(err){
                expect(err).to.deep.equal(error);

                done();
            };

            //Call function.
            es.validators.isMember(value, es.prefs, nextFunc, array);
        });//End of it.
    });//End of #isMember.
    describe("#isSubset", function(){
        it("Should pass if the given array is subset of target array", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = ["A", "C"];
            let array = ["A", "B", "C"];

            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isSubset(value, es.prefs, nextFunc, array);
        });//End of it.
        it("Should pass if the given array is subset of target array: Single element", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = ["A"];
            let array = ["A", "B", "C"];

            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isSubset(value, es.prefs, nextFunc, array);
        });//End of it.
        it("Should not pass if the given array is empty", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = [];
            let array = ["A", "B", "C"];

            //Mock error.
            let error = new es.HTTPError(400, es.prefs.errMessages.validator.isSubset(value, array));


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.deep.equal(error);

                done();
            };

            //Call function.
            es.validators.isSubset(value, es.prefs, nextFunc, array);
        });//End of it.
        it("Should not pass if the given value is not an array", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = "NOT AN ARRAY";
            let array = ["A", "B", "C"];

            //Mock error.
            let error = new es.HTTPError(400, es.prefs.errMessages.validator.isSubset(value, array));


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.deep.equal(error);

                done();
            };

            //Call function.
            es.validators.isSubset(value, es.prefs, nextFunc, array);
        });//End of it.
        it("Should not pass if the given array is not subset of the target array", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = "NOT AN ARRAY";
            let array = ["A", "B", "C"];

            //Mock error.
            let error = new es.HTTPError(400, es.prefs.errMessages.validator.isSubset(value, array));


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.deep.equal(error);

                done();
            };

            //Call function.
            es.validators.isSubset(value, es.prefs, nextFunc, array);
        });//End of it.
    });//End of #isSubset.
    describe("#isInRange", function(){
        it("Should pass if the given value is in range (Normal value)", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = 0;
            let min = -5, max = 5, inclusive = true;


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isInRange(value, es.prefs, nextFunc, min, max, inclusive);
        });//End of it.
        it("Should pass if the given value is in range (boundary value, inclusive)", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = -5;
            let min = -5, max = 5, inclusive = true;


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isInRange(value, es.prefs, nextFunc, min, max, inclusive);
        });//End of it.
        it("Should not pass if the given value is not in range (boundary value, exclusive)", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = -5;
            let min = -5, max = 5, inclusive = false;

            //Mock error.
            let error = new es.HTTPError(400, es.prefs.errMessages.validator.isInRange(value, min, max, inclusive));

            //Mock next.
            let nextFunc = function(err){
                expect(err).to.deep.equal(error);

                done();
            };

            //Call function.
            es.validators.isInRange(value, es.prefs, nextFunc, min, max, inclusive);
        });//End of it.
        it("Should not pass if the given value is not in range (non boundary value, exclusive)", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = -100;
            let min = -5, max = 5, inclusive = false;

            //Mock error.
            let error = new es.HTTPError(400, es.prefs.errMessages.validator.isInRange(value, min, max, inclusive));

            //Mock next.
            let nextFunc = function(err){
                expect(err).to.deep.equal(error);

                done();
            };

            //Call function.
            es.validators.isInRange(value, es.prefs, nextFunc, min, max, inclusive);
        });//End of it.
    });//End of #isInRange.
    describe("#isOfType", function(){
        it("Should pass if the given value is of type: Number", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = -5;
            let type = "number";


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isOfType(value, es.prefs, nextFunc, type);
        });//End of it.
        it("Should pass if the given value is of type: String", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = "-5";
            let type = "string";


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isOfType(value, es.prefs, nextFunc, type);
        });//End of it.
        it("Should pass if the given value is of type: User defined", function(done){
            let es = new ExpressSteroid();

            let TestClass = function(name, age){
                  this.name = name;
                  this.age = age;
            };

            //Mock.
            let value = new TestClass("John", 50);
            let type = "object";


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isOfType(value, es.prefs, nextFunc, type);
        });//End of it.
        it("Should pass if the given value is of type: Array", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = [1,2,3,4];
            let type = "array";


            //Mock next.
            let nextFunc = function(err){
                expect(err).to.be.undefined;

                done();
            };

            //Call function.
            es.validators.isOfType(value, es.prefs, nextFunc, type);
        });//End of it.
        it("Should not pass if the given value is not of correct type", function(done){
            let es = new ExpressSteroid();

            //Mock.
            let value = "TEST_STRING";
            let type = "number";


            //Mock error.
            let error = new es.HTTPError(400, es.prefs.errMessages.validator.isOfType(value, type));

            //Mock next.
            let nextFunc = function(err){
                expect(err).to.deep.equal(error);

                done();
            };

            //Call function.
            es.validators.isOfType(value, es.prefs, nextFunc, type);
        });//End of it.
    });//End of #isOfType.
});//End of describe.