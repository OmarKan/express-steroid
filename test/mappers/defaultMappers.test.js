/**
 * defaultMappers.test.js, contains tests for default mappers.
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
const ObjectId      = require('mongoose').Types.ObjectId;


describe("Default mappers", function(){
    describe("objectIdMapper", function(){
        it("Should convert a valid string to object id", function(done){
            let es = new ExpressSteroid();
            let id = new ObjectId();

            //Mock req.
            let req = {
                data: {
                    "key1": id.toString(),
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.objectIdMapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            expect(req[es.prefs.dataObjName].key1).to.deep.equal(id);

            //Done.
            done();
        });//End of it.

        it("Should not convert an invalid object id", function(done){
            let es = new ExpressSteroid();
            let id = new ObjectId();

            //Mock req.
            let req = {
                data: {
                    "key1": id.toString() + "asdf",
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.objectIdMapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            expect(req[es.prefs.dataObjName].key1).to.deep.equal(undefined);

            //Done.
            done();
        });//End of it.
    });//End of objectIdMapper.

    describe("dateMapper", function(){
        it("Should convert a valid string to a date", function(done){
            let es = new ExpressSteroid();
            let date = "2010-01-05";

            //Mock req.
            let req = {
                data: {
                    "key1": date,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.dateMapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            expect(req[es.prefs.dataObjName].key1).to.deep.equal(new Date(date));

            //Done.
            done();
        });//End of it.
        it("Should not convert an invalid string", function(done){
            let es = new ExpressSteroid();
            let date = "SOMETHING invalid";

            //Mock req.
            let req = {
                data: {
                    "key1": date,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.dateMapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();


            expect(req[es.prefs.dataObjName].key1).to.deep.equal(new Date(date));

            //Done.
            done();
        });//End of it.
    });//End of dateMapper.
    describe("intMapper", function(){
        it("Should convert a valid string to an integer", function(done){
            let es  = new ExpressSteroid();
            let num = "-5420";

            //Mock req.
            let req = {
                data: {
                    "key1": num,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.intMapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            expect(req[es.prefs.dataObjName].key1).to.equal(-5420);

            //Done.
            done();
        });//End of it.
        it("Should not convert an invalid string to an integer", function(done){
            let es = new ExpressSteroid();
            let num = "INVALID";

            //Mock req.
            let req = {
                data: {
                    "key1": num,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.intMapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            //Expect it to be nan.
            expect(req[es.prefs.dataObjName].key1).to.be.NaN;

            //Done.
            done();
        });//End of it.
    });//End of intMapper.
    describe("floatMapper", function(){
        it("Should convert a valid string to a float", function(done){
            let es  = new ExpressSteroid();
            let num = "-5420.250";

            //Mock req.
            let req = {
                data: {
                    "key1": num,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.floatMapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            expect(req[es.prefs.dataObjName].key1).to.equal(-5420.250);

            //Done.
            done();
        });//End of it.
        it("Should not convert an invalid string to a float", function(done){
            let es = new ExpressSteroid();
            let num = "INVALID";

            //Mock req.
            let req = {
                data: {
                    "key1": num,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.floatMapper, null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            //Expect it to be nan.
            expect(req[es.prefs.dataObjName].key1).to.be.NaN;

            //Done.
            done();
        });//End of it.
    });//End of floatMapper.
    describe("String to Array Mapper", function(){
        it("Should convert a string to an array with specified separator", function(done){
            let es = new ExpressSteroid();
            let value = "Element1,Element2";

            //Mock req.
            let req = {
                data: {
                    "key1": value,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.stringToArrayMapper(","), null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            //Expect it to be nan.
            expect(req[es.prefs.dataObjName].key1).to.be.deep.equal(["Element1", "Element2"]);

            //Done.
            done();
        });//End of it.
        it("Should convert a string to an array with specified separator", function(done){
            let es = new ExpressSteroid();
            let value = "E1 E2,E3 E4";

            //Mock req.
            let req = {
                data: {
                    "key1": value,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.stringToArrayMapper(" "), null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            //Expect it to be nan.
            expect(req[es.prefs.dataObjName].key1).to.be.deep.equal(["E1", "E2,E3", "E4"]);

            //Done.
            done();
        });//End of it.
        it("Should not convert a string to an array if the value is invalid", function(done){
            let es = new ExpressSteroid();
            let value = 500;

            //Mock req.
            let req = {
                data: {
                    "key1": value,
                    "key2": [1, 2, 3]
                }
            };

            //Mock params.
            let params = ["key1"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.parse(params, es.mappers.stringToArrayMapper(","), null)(req, null, spy);

            //Next should not be called.
            expect(spy).to.be.calledWith();

            //Expect it to be nan.
            expect(req[es.prefs.dataObjName].key1).to.be.deep.equal(undefined);

            //Done.
            done();
        });//End of it.
    });//End of String to Array Mapper.
});//End of Default Mappers test.