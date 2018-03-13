/**
 * manipulator.test.js, contains tests for manipulator module.
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


describe("Manipulator", function(){
    describe("#parse", function(){
        it("Should parse the values of given params", function(done){
            let es = new ExpressSteroid();
            let newValue = "NEW VALUE";

            //Mock req.
            let req = {};
            req[es.prefs.dataObjName] = {
                "key1": "value1",
                "key2": [1, 2, 3]

            };

            //Mock params.
            let params = ["key1", "key2"];

            //Mock next.
            let spy = sinon.spy();

            //Mock mapper.
            function mapper(value){
                expect(value).to.be.oneOf([req[es.prefs.dataObjName].key1, 1,2,3]);
                return "NEW VALUE";
            }

            //Call the function.
            es.parse(params, mapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            //Check if the value is parsed.
            expect(req[es.prefs.dataObjName].key1).to.be.equal(newValue);
            expect(req[es.prefs.dataObjName].key2).to.be.deep.equal([newValue, newValue, newValue]);

            done();
        });//End of it.
        it("Should throw an error if the params are valid", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {};
            req[es.prefs.dataObjName] = {
                "key1": "value1",
                "key2": [1, 2, 3]

            };

            //Mock params.
            let params = 1;

            //Mock next.
            let spy = sinon.spy();

            //Mock mapper.
            function mapper(value){
                expect(value).to.be.oneOf([req[es.prefs.dataObjName].key1, 1,2,3]);
                return value;
            }

            //Call the function.
            try{
                es.parse(params, mapper, null)(req, null, spy);
            }
            catch(error){
                expect(error.message).to.be.equal(es.prefs.errMessages.manipulator.paramNotCorrect(undefined));
            }

            //Next should not be called.
            expect(spy).to.have.callCount(0);

            done();
        });//End of it.
        it("Should throw an error if the mapper is not a function", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {};
            req[es.prefs.dataObjName] = {
                "key1": "value1",
                "key2": [1, 2, 3]

            };

            //Mock params.
            let params = ["key1", "key2"];

            //Mock next.
            let spy = sinon.spy();

            //Mock mapper.
            let mapper = "Hello world";

            //Call the function.
            try{
                es.parse(params, mapper, null)(req, null, spy);
            }
            catch(error){
                expect(error.message).to.be.equal(es.prefs.errMessages.manipulator.paramNotCorrect(mapper));
            }
            //Next should not be called.
            expect(spy).to.have.callCount(0);

            done();
        });//End of it.
        it("Should pass with no errors if the param is not found", function(done){
            let es = new ExpressSteroid();
            let newValue = "NEW VALUE";

            //Mock req.
            let req = {};
            req[es.prefs.dataObjName] = {
                "key1": "value1",
                "key2": [1, 2, 3]

            };

            //Mock params.
            let params = ["key1", "notFoundKey"];

            //Mock next.
            let spy = sinon.spy();

            //Mock mapper.
            function mapper(value){
                expect(value).to.be.oneOf([req[es.prefs.dataObjName].key1, 1,2,3]);
                return newValue;
            }

            //Call the function.
            es.parse(params, mapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            expect(req[es.prefs.dataObjName].key1).to.equal(newValue);
            expect(req[es.prefs.dataObjName].key2).to.deep.equal([1,2,3]);
            done();
        });//End of it.

    });//End of #parse.
});//End of manipulator test.

