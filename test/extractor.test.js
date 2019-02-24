/**
 * extractor.test.js, contains tests for extractor module.
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
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;



describe("Extractor", function(){
    describe("#findAndSetValues", function(){
        it("Should find specified values in req in given sources, and sets them in req[prefs.dataObjName]", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "key3", "key4"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.findAndSetValues(params, es.prefs.extractor.sources, true, req, spy);

            //Next should not be called.
            expect(spy).to.have.callCount(0);

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.body, req.query, req.params);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
        it("Should find specified values in req in given sources, and sets them in req[prefs.dataObjName]", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "key4"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.findAndSetValues(params, es.prefs.extractor.sources, true, req, spy);

            //Next should not be called.
            expect(spy).to.have.callCount(0);

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.body, req.params);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
        it("Should find specified values in req in given sources, and sets them in req[prefs.dataObjName]", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.findAndSetValues(params, ["body"], true, req, spy);

            //Next should not be called.
            expect(spy).to.have.callCount(0);

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.body);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.

        it("Should return an error if a variable is required and is not found", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "missingKey"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.findAndSetValues(params, es.prefs.extractor.sources, true, req, spy);

            //Next should be called once.
            expect(spy).to.have.callCount(1);

            //Mock the error.
            let err = new es.HTTPError(400, es.prefs.errMessages.extractor.paramNotFound("missingKey"));
            //Next should be called with an error.
            expect(spy).to.have.been.calledWith(err);

            //Done.
            done();
        });//End of test.
        it("Should not return an error if a variable is optional and is not found", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key3", "key4", "missingKey"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.findAndSetValues(params, es.prefs.extractor.sources, false, req, spy);

            //Next should not be called.
            expect(spy).to.have.callCount(0);

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.query, req.params);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
    });//End of #findAndSetValues.

    describe("#extract", function(){
        it("Should extract params with given names, if they are found", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "key3", "key4"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.extract(params, true)(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.query, req.params, req.body);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
        it("Should extract params from preferences modified sources", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "key3"];

            //Mock next.
            let spy = sinon.spy();

            //specify sources.
            es.prefs.extractor.sources = ["body"];

            //Call the function.
            es.extract(params, false)(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.body);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
        it("Should extract params from given sources", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "key3"];

            //Mock next.
            let spy = sinon.spy();


            //Call the function.
            es.extract(params, false, ["body"])(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.body);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
        it("Should not extract anything if the sources are empty", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "key3"];

            //Mock next.
            let spy = sinon.spy();

            //Specify sources.
            es.prefs.extractor.sources = [];

            //Call the function.
            es.extract(params, false)(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(undefined);

            //Done.
            done();
        });//End of test.
        it("Should not extract anything if the sources are missing", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "key3"];

            //Mock next.
            let spy = sinon.spy();

            //Specify sources.
            es.prefs.extractor.sources = undefined;

            //Call the function.
            es.extract(params, false)(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(undefined);

            //Done.
            done();
        });//End of test.
        it("Should extract params to modified dataObjName", function(done){
            //Specify dataObjName.
            let newObjName = "newObjName";

            let es = new ExpressSteroid({dataObjName: newObjName});

            //Mock req.
            let req = {
                body: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                }
            };

            //Mock params.
            let params = ["key1", "key2", "key3", "key4"];

            //Mock next.
            let spy = sinon.spy();

            //Call the function.
            es.extract(params, true)(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.query, req.params, req.body);

            //Check req.
            expect(req[newObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
    });//End of #extract.

    describe('#extractFromSchema', function(){
        before(function(){
            mockSchema();
        });


        it("Should extract all schema params", function(done){
            let es = new ExpressSteroid();


            //Mock next.
            let spy = sinon.spy();

            //Mock req.
            let req = {
                body: {
                    name: "John Doe",
                    location: {
                        lng: 400,
                        lat: 200
                    }
                },
                query: {
                    jobTitle: "Engineer"
                },
                params: {
                    email: "john@example.com"
                }
            };

            //Call the function.
            es.extractFromSchema(getModel(), true, true)(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.query, req.params, req.body);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.

        it("Should extract all schema params, except for ignored ones", function(done){
            let es = new ExpressSteroid();


            //Mock next.
            let spy = sinon.spy();

            //Mock req.
            let req = {
                body: {
                    name: "John Doe",
                    location: {
                        lng: 400,
                        lat: 200
                    }
                },
                query: {
                    jobTitle: "Engineer"
                },
                params: {
                    email: "john@example.com"
                }
            };

            //Call the function.
            es.extractFromSchema(getModel(), true, true, ["location.lat", "email"])(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            delete req.body.location.lat;

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.query, req.body);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
        it("Should return an error if param is missing, and requiredAll = true, checkRequired=true", function(done){
            let es = new ExpressSteroid();


            //Mock next.
            let spy = sinon.spy();

            //Mock req.
            let req = {
                body: {
                    name: "John Doe",
                    location: {
                        lng: 400
                    }
                },
                query: {
                    jobTitle: "Engineer"
                },
                params: {
                    email: "john@example.com"
                }
            };

            //Call the function.
            es.extractFromSchema(getModel(), true, true)(req, null, spy);

            //Mock the error.
            let err = new es.HTTPError(400, es.prefs.errMessages.extractor.paramNotFound("location.lat"));

            //Next should be called with an error.
            expect(spy).to.have.been.calledWith(err);

            //Done.
            done();
        });//End of test.
        it("Should return an error if param is missing, and requiredAll = true, checkRequired=false", function(done){
            let es = new ExpressSteroid();


            //Mock next.
            let spy = sinon.spy();

            //Mock req.
            let req = {
                body: {
                    name: "John Doe",
                    location: {
                        lng: 400
                    }
                },
                query: {
                    jobTitle: "Engineer"
                },
                params: {
                    email: "john@example.com"
                }
            };

            //Call the function.
            es.extractFromSchema(getModel(), true, false)(req, null, spy);

            //Mock the error.
            let err = new es.HTTPError(400, es.prefs.errMessages.extractor.paramNotFound("location.lat"));

            //Next should be called with an error.
            expect(spy).to.have.been.calledWith(err);

            //Done.
            done();
        });//End of test.
        it("Should return an error if required param is missing, and requiredAll = false, checkRequired=true", function(done){
            let es = new ExpressSteroid();


            //Mock next.
            let spy = sinon.spy();

            //Mock req.
            let req = {
                body: {
                    name: "John Doe",
                    location: {
                        lat: 200
                    }
                },
                query: {
                    jobTitle: "Engineer"
                },
                params: {
                    email: "john@example.com"
                }
            };

            //Call the function.
            es.extractFromSchema(getModel(), false, true)(req, null, spy);

            //Mock the error.
            let err = new es.HTTPError(400, es.prefs.errMessages.extractor.paramNotFound("location.lng"));

            //Next should be called with an error.
            expect(spy).to.have.been.calledWith(err);

            //Done.
            done();
        });//End of test.
        it("Should not return an error if required param is missing, and requiredAll = false, checkRequired=false", function(done){
            let es = new ExpressSteroid();


            //Mock next.
            let spy = sinon.spy();

            //Mock req.
            let req = {
                body: {
                    name: "John Doe",
                    location: {
                        lat: 200,
                        lng: 400
                    }
                },
                query: {
                    jobTitle: "Engineer"
                },
                params: {
                    email: "john@example.com"
                }
            };

            //Call the function.
            es.extractFromSchema(getModel())(req, null, spy);

            //Next should be called with nothing.
            expect(spy).to.have.been.calledWith();

            //Construct expected req[prefs.dataObjName].
            let expected = Object.assign({}, req.query, req.body, req.params);

            //Check req.
            expect(req[es.prefs.dataObjName]).to.deep.equal(expected);

            //Done.
            done();
        });//End of test.
    });//End of #extractFromSchema.
});//End of extractor testing.

function getSchemaFields(){
    return {
        name        : {type: String, required: true},
        email       : {type: String, required: true},
        jobTitle    : {type: String},
        location    : {
            lng     : {type: Number, required: true},
            lat     : {type: Number}
        }
    }
}

function getModel(){
    return mongoose.model("User");
}

function mockSchema(){
    let schema = new Schema(getSchemaFields());

    mongoose.model("User", schema);
}