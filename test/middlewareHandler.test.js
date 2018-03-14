/**
 * middlewareHandler.test.js, contains tests for middlewareHandler module.
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



describe("Middleware Handler", function(){
    describe("#inject", function(){
        it("Should middlewareHandler a given function with parameters values", function(done){
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

            //Mock res
            let res = "RES";

            //Mock next.
            let next = sinon.spy();

            //Mock func.
            let func = function(key1, key2, key3, key4){
                expect(key1).to.equal(req.body.key1);
                expect(key2).to.deep.equal(req.body.key2);
                expect(key3).to.equal(req.query.key3);
                expect(key4).to.equal(req.params.key4);

                done();
            };


            //Call the function.
            es.inject(func, ["body", "query", "params"])(req, res, next);
        });//End of it.
        it("Should middlewareHandler a given function with parameters values from correct sources", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                data: {
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

            //Mock res
            let res = "RES";

            //Mock next.
            let next = sinon.spy();

            //Mock func.
            let func = function(key1, key2, key3, key4){
                expect(key1).to.equal(req.data.key1);
                expect(key2).to.deep.equal(req.data.key2);
                expect(key3).to.be.undefined;
                expect(key4).to.be.undefined;

                done();
            };

            //Call the function.
            es.inject(func)(req, res, next);
        });//End of it.
        it("Should middlewareHandler a given function with parameters values from correct sources, and middlewareHandler defaults if not found", function(done){
            let es = new ExpressSteroid();

            //Mock req.
            let req = {
                data: {
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

            //Mock res
            let res = "RES";

            //Mock next.
            let next = sinon.spy();

            //Define defaults.
            let key3Default = [1,"Test", 2];
            let key4Default = {default: "value"};

            //Mock func.
            let func = function(key1, key2, key3, key4){
                expect(key1).to.equal(req.data.key1);
                expect(key2).to.deep.equal(req.data.key2);
                expect(key3).to.deep.equal(key3Default);
                expect(key4).to.deep.equal(key4Default);

                done();
            };

            //Call the function.
            es.inject(func, null, {key1: "Default1", key3: key3Default, key4: key4Default})(req, res, next);
        });//End of it.
        it("Should middlewareHandler a given function with parameters values and default injections", function(done){
            let es = new ExpressSteroid();
            let userValue = "USER";

            es.prefs.middlewareHandler.defaultInjection = ["req", "user"];

            //Mock req.
            let req = {
                data: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                },
                user: userValue
            };

            //Mock res
            let res = "RES";

            //Mock next.
            let next = sinon.spy();

            //Mock func.
            let func = function(key1, key2, user, req, res){
                expect(key1).to.equal(req.data.key1);
                expect(key2).to.deep.equal(req.data.key2);
                expect(user).to.deep.equal(userValue);
                expect(req).to.deep.equal(req);
                expect(res).to.be.undefined;

                done();
            };//End of Func.

            //Call the function.
            es.inject(func)(req, res, next);
        });//End of it.
        it("Should throw an error when func is not a function", function(done){
            let es = new ExpressSteroid();
            let userValue = "USER";

            //Mock req.
            let req = {
                data: {
                    "key1": "value1",
                    "key2": [1, 2, 3]
                },
                query: {
                    "key3": 50
                },
                params: {
                    "key4": "value4"
                },
                user: userValue
            };

            //Mock res
            let res = "RES";

            //Mock next.
            let next = sinon.spy();

            //Mock func.
            let func = "NOT A FUNCTION";

            //Call the function.
            try{
                es.inject(func)(req, res, next);
            }
            catch(err){
                expect(err.message).to.be.equal(es.prefs.errMessages.middlewareHandler.paramNotFunction(func));
                done();
            }
        });//End of it.
        it("Should inject result handlers correctly: respond", function(done){
            let es = new ExpressSteroid();


            //Mock req.
            let req = {
                data: {
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
            //Mock next.
            let next = sinon.spy();

            //Mock response to be sent by responderHandler.
            let response = {
                key1: "value1"
            };


            //Mock res.status.json.
            let jsonFunc = function(json){
                expect(json).to.equal(response);

                done();
            };

            //Mock res.status
            let statusFunc = function(status){
                expect(status).to.equal(200);

                return {json: jsonFunc};
            };

            //Mock res
            let res = {
                status: statusFunc
            };

            //Mock func.
            let func = function(respond){
                respond(null, response, 200);
            };

            //Call the function.
            es.inject(func)(req, res, next);
        });//End of it.
        it("Should inject result handlers correctly: respond, with an error", function(done){
            let es = new ExpressSteroid();


            //Mock req.
            let req = {
                data: {
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

            //Mock error
            let error = {
                key1: "value1"
            };

            //Mock next.
            let next = function(err){
                expect(err).to.deep.equal(error);

                done();
            };


            //Mock func.
            let func = function(respond){
                respond(error);
            };

            //Call the function.
            es.inject(func)(req, null, next);
        });//End of it.
        it("Should inject result handlers correctly: passToNext", function(done){
            let es = new ExpressSteroid();


            //Mock req.
            let req = {
                data: {
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
            //Add some already passed results
            req[es.prefs.resultsObjName] = {
                key1: "value1"
            };

            //Mock next.
            let next = function(){
                expect(req[es.prefs.resultsObjName]).to.deep.equal(Object.assign({key1: "value1"}, {key2: "value2"}));

                done();
            };//End of next function.


            //Mock func.
            let func = function(passToNext){
                passToNext(null, {key2: "value2"});
            };

            //Call the function.
            es.inject(func)(req, null, next);
        });//End of it.
        it("Should inject result handlers correctly: passToNext, with an error", function(done){
            let es = new ExpressSteroid();


            //Mock req.
            let req = {
                data: {
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
            //Add some already passed results
            req[es.prefs.resultsObjName] = {
                key1: "value1"
            };

            //Mock error.
            let error = {
                key1: "value1"
            };

            //Mock next.
            let next = function(err){
                expect(err).to.deep.equal(error);

                done();
            };//End of next function.


            //Mock func.
            let func = function(passToNext){
                passToNext(error);
            };

            //Call the function.
            es.inject(func)(req, null, next);
        });//End of it.
    });//End of #middlewareHandler.
});//End of MiddlewareHandler.