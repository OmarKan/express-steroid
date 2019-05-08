
  
# Express Steroid  
An extension to ExpressJs that provides powerful features to simplify API input handling, parsing, validation, code testing, and query building for MongoDB.
  
## Table of contents  
  
* [Introduction](#introduction)  
* [Installation](#installation)  
* [Usage](#usage)  
   * [Initialization](#initialization)
   * [Input Extraction](#input-extraction)
   * [Input Parsing](#input-parsing)
   * [Input Validation](#input-validation)
   * [Query Building](#query-building)
   * [Injection](#injection)
   * [ES preferences object](#es-preferences-object)
   * [HTTP Error](#httperror)
* [Example Project](#example-project)
* [Tests](#tests)
* [Motivation](#motivation)
* [Contribution](#contribution)
* [Todo](#todo)
* [Acknowledgements](#acknowledgements)
## Introduction  
This library imposes a new way of using ExpressJs, which, when followed correctly, has the following positives:
- Significantly reduces development time.
- Increases code modularity.
- Enhances separation of concerns.
- Simplifies testing of service functions.
- Reduces lines of codes.
- Increases robustness.

All of the above will be apparent when Using the main aspects of Express Steroid, which are:
- **Input Extraction:** Extracting input sent by a user, and storing them in one object for easy access.
- **Input Parsing:** Parsing extracted input, to make them ready for use.
- **Input Validation:** Ensuring validity of extracted input.
- **Query Building:** Building MongoDB queries from extracted input, and storing them in one object for easy access.
- **Injection:** Does all of the following:
    - Injecting extracted input and added objects into a non-middleware function.
    - Converting the injected function into a middleware ready for ExpressJs.
    - Controlling the flow from one middleware to another.
    - And handling results from the function directly.



  
## Installation  
To install Express Steroid:  
```sh  
npm install --save express-steroid  
```  
  
## Usage  

### Initialization.
It's recommended that you declare and initialize an ExpressSteroid instance, and use it across the system:

```javascript
module.exports = {
    es: new require('express-steroid')();
};
```

You can also specify preferences, which are detailed [here](#es-preferences-object).

### Input Extraction.
#### Purpose.
1. Extracting input sent by the client from different sources, and combining them in one object.
2. Simplifies handling input by users.
3. Ignoring any input sent by the client that's not accounted for.
4. Usually used in conjunction with other functions in Express Steroid.
#### functions.
All extract functions extract the parameters with given names, from given sources in (req) Object, and combine them all in one object which is specified by the field in ```es.prefs.dataObjectName```.
All extract functions are used in as ExpressJs Middlewares.

##### es.extract(parametersNames \[, parametersRequired, sources])

Parameters:

| Name | Type | Required? | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
| parametersNames | String Or Array | Yes | N/A | Names of input parameters to extract. If it's a string, then values are separated by spaces by default (Can be changed from ```es.prefs.extractor.separator```) |
| parametersRequired | Boolean | No | false  | Whether or not to return an error if any parameter is missing. Error message is specified by: ```es.prefs.errMessages.paramNotFound``` |
| sources | array | No | ```es.prefs.extractor.sources``` | The array should  contain only strings, which are names of fields in (req) object. Used to look for parameters in them |


Extract an "id" and "name" from any of the default sources, if the id or name are not found anywhere in the sources, an error is returned.
```javascript
router.get('/', es.extract('id name', true));
```
Using an array instead of a string:
```javascript
router.get('/', es.extract(['id', 'name'], true));
```

Extract "id" and "name" and if a value is not found, it's simply ignored:
```javascript
router.get('/', es.extract('id name'));
```

Only look in "body" and "query" sources:
```javascript
router.get('/', es.extract('id name', false, ['body', 'query']));
```

The extracted fields, are found all in req\[es.prefs.dataObjectName].

##### es.requiredExtract(parametersNames \[, sources])
Simply calls es.extract with ```parametersRequired``` set to true.

##### es.extractFromSchema(schemaName \[, requiredAll, checkRequired, ignoredFields, sources])
Extracts input parameters, but instead of specifying names of parameters to be extracted, you specify the model of a **registered** Mongoose Schema and it will extract all of its fields.

*Side Note: Using this, along with other functions, means that if you have CRUD API, and you changed a field in the schema of the model, You won't have to modify the API or the service function.*

Parameters:

| Name | Type | Required? | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
| model | Mongoose Model Object | Yes | N/A | Mongoose model object of the schema to extract from, the schema must be already registered |
| requiredAll | Boolean | No | false | If set to true, it means that all fields of the schema must be present as input  to call |
| checkRequired | Boolean | No | false | If set to true, it means that only fields that are  marked as required in the schema are required in the call. If this field and ```requiredAll``` are both set to false, then all parameters from the schema are optional |
| ignoredFields | Array | No | ```es.prefs.extractor.ignoredFields``` | Array of strings, containing names of fields in the Schema to be ignored and not extracted. Great to use it for ```password``` fields for example. |
| sources | Array | No |  ```es.prefs.extractor.sources``` | The array should  contain only strings, which are names of fields in (req) object. Used to look for parameters in them |

Extract all fields of an "Employee" schema, and only required fields in the schema are required in the call, and id is ignored.

```javascript
let employee = mongoose.model("Employee", employeeSchema);

router.get('/', es.extractFromSchema(employee, false, true, ['id']));
```

### Input Parsing.
#### Purpose.
1. Allows extracted input to be parsed to the correct format before using it.
2. Reduces lines of codes used in the service functions to handle input.

#### functions.

##### es.parse(parametersNames, mapper \[, sources])
Parses parameters with given names, using given mapper function.
If a parameter value is An Array, it applies  the mapper function to each one of the values of the array.

**Note: If a field is not found, it's simply ignored**

Parameters:

| Name | Type | Required? | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
| parametersNames | String Or Array | Yes | N/A | Names of input parameters to parse. If it's a string, then values are separated by spaces by default (Can be changed from ```es.prefs.manipulator.separator```) |
| mapper | Function | Yes | N/A | A function that takes a single input and returns an output immediately. Each parameter will be called by the mapper, then stored in place. |
| sources | Array | No |  ```es.prefs.manipulator.sources``` | The array should  contain only strings, which are names of fields in (req) object. Used to look for parameters in them |



Parse strings to integers for two fields.
```javascript
function toInteger(text){
    return parseInt(text);
}


router.get('/', es.extract("skip limit"), es.parse("skip limit", toInteger));
```

Now the fields: req\[es.prefs.dataObjName].skip & req\[es.prefs.dataObjName].limit are both integers.


#### Default mappers.
Express Steroid comes with  useful default mappers, that are frequently needed.
All are available in ```es.mappers```

| Mapper Name | Input | Output |
| ----------- | ----- | ------ |
| objectIdMapper | String | ObjectId (Mongoose) |
| dateMapper | String | Date (JS) |
| intMapper | String | Integer |
| floatMapper | String | Float |
| stringToArrayMapper | String | Array |


Extract an id and convert it to ObjectId directly to be used immediately by the service function:
```javascript
router.get('/', es.extract("id"), es.parse("id", es.mappers.objectIdMapper));
```

The following is an example where stringToArrayMapper is useful.
```javascript

//Names is a parameter sent by client like: "John,Mark,James".

router.get('/', es.extract("names"), es.parse("names", es.mappers.stringToArrayMapper(",")));

//After the mapping, the field req[es.prefs.dataObjName].names will = ['John', "Mark", "James"]
```

### Input Validation.
Validates input and passes if and only if the validator returns true.

#### Purpose.
1. Validate input sent by the user.
2. Reduce redundancy by validating before entering a service function.

#### Functions.

##### validate(parameterName, validator \[, ...args])
Validates a single parameter with given parameter name using  the given validator.

If the value to be validated is not found, it's ignored.

Parameters:

| Name | Type | Required? | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
| parameterName | String | Yes | N/A | Parameter name to be validated |
| Validator | Function | Yes | N/A | Function used for validation, must return true/false immediately |
| ... args | Arguments | No | N/A | Further arguments that can be passed to the validator function |


Validate an integer.

```javascript
function isPositive(number, prefs, next){
    if (number >= 0) return next();
    else return next(new Error(number + ' is not a positive number'));
}


router.get('/', es.extract("skip limit"), es.parse("skip limit", toInteger),
                es.validate("skip", isPositive));
```

Validate input with extra parameters.
```javascript
let allowedValues = ["Cat", "Dog", "Bird"];
function isAllowed(value, prefs, next, array){
    if (array.indexOf(value) >= 0) return next();
    else return next(new Error(value + ' is not allowed'));
}


router.get('/', es.extract("animal"),
                es.validate("animal", isAllowed, allowedValues));
```

##### validateAll(parametersNames, validator \[, ...args])
Validates multiple parameters using a given validator. Only passes if all parameters are correct.

If a value is not  found, it's ignored.


Parameters:

| Name | Type | Required? | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
| parametersNames | String or Array | Yes | N/A | names of parameters to be validated, it should an array of strings  or a string of names separated by the separator specified in ```es.prefs.validator.separator```|
| Validator | Function | Yes | N/A | Function used for validation, must return true/false immediately |
| ... args | Arguments | No | N/A | Further arguments that can be passed to the validator function |


Validate multiple input.
```javascript
function isPositive(number, prefs, next){
    if (number >= 0) return next();
    else return next(new Error(number + ' is not a positive number'));
}


router.get('/', es.extract("skip limit"), es.parse("skip limit", toInteger),
                es.validateAll("skip limit", isPositive));
```

#### Default Validators.
Express Steroid has built-in frequently used validators. All are in ```es.validators```

| Validator Name | Validation | Default Error message |
| -------------- | ---------- | --------------------- |
| isMember | Validates if the given value is a member of a given array | ```es.prefs.isMember``` Function that takes two arguments (value, array) |
| isSubset | Validates if the given array is a subset of another given array | ```es.prefs.isSubset ```  Function that takes two arguments (value, array) |
| isInRange | Validates if the given integer is between two values (and specify whether it's inclusive or not) | ```es.prefs.isInRange``` Function that takes 4 arguments (value, min, max, isInclusive)  |
| isOfType | Validates if the given value is of the given type | ```es.prefs.isOfType ``` Function that takes two arguments (value, type) |

#### Custom validators.
You can use a custom made validator, as seen above. However, all validators should have the following signature:
```functionName(valueToBeValidated [, es.prefs, next, ... argsPassedByUser])```

Notice that ```es.prefs``` which contains preferences is also accessible in any validator.

Notice that validators are async functions, and they call "next" either with no error or with an error.


### Query Building.
Creates Mongoose filtering|Sorting objects out of input parameters sent by the user, and store them in ```req[es.prefs.queryBuilder.queriesObjName]```

#### Purpose.
1. Build query objects directly from the Router middlewares, reducing lines of codes and efforts.
2. Minimize redundancy of building basic queries in service functions.

#### functions.

##### buildQuery(paramName, resultFieldName, query \[, dbFieldName, ...queryArgs])

Note that if a value is not found, it's ignored and query is not built.

Parameters:

| Name | Type | Required? | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
| paramName | String | Yes | N/A | Name of the input parameter to be used for the query |
| resultFieldName | String | Yes | N/A | The name field that contains the built query, which is in  ```req[es.prefs.queryBuilder.queriesObjName]``` |
| query | Function | Yes | N/A | Query function, takes three parameters specified later |
| dbFieldName | String | No | Null | Name of the field in the database to query from |
| ...queryArgs | Arguments | No | N/A | Additional arguments to be sent to the query function |

Build an equality query out of "email" field using one of ES default queries.
```javascript
router.get('/', es.extract("email"),
                es.buildQuery("email", "filters", es.queries.equality));

//After this middleware => req[es.prefs.queryBuilder.queriesObjName]['filters'] = {email: "email field value"}
```

Build another query which is a partial string match query out of "mobile" field using one of ES default queries.
```javascript
router.get('/', es.extract("mobile email"),
                es.buildQuery("email", "filters", es.queries.equality),
                es.buildQuery("mobile", "filters", es.queries.partialStringMatch, "phoneNumber"));

//After this middleware =>
//          req[es.prefs.queryBuilder.queriesObjName]['filters'] = {
//              phoneNumber: {$regex: "mobile field value"},
//              email: "email field value"
//           }
```

#### Default queries.
Express Steroid has multiple frequently used built-in default queries.
All are available in ```es.queries```


| Query Name | Parameters | Result |
| ---------- | ---------- | ------ |
| equality | (value, dbFieldName) | ```{dbFieldName: {$eq: value}}``` |
| range | (array, dbFieldName, inclusive) | If not inclusive: ```{dbFieldName: {$gt: array[0], $lt: array[1]}}``` If inclusive: ```{dbFieldName: {$gte: array[0], $lte: array[1]}}```|
| inArray | (value, dbFieldName) | ```{dbFieldName: {$in: value}}``` | 

#### Custom queries. 
You can use custom queries. However, a query function must have the  following signature: 
```queryFunction(value, dbFieldName, ... args)```

### Injection.
One of the most important aspects of Express Steroid is injection.

#### Purpose.
All of the following purposes will be clearer later.
1. Allow service functions to have usual signatures, rather than the usual (req, res, next).
2. Eliminate need to read input, validate input, parse input, in service functions.
3. Make service functions easily testable, by making them independent.
4. Separate logic of handling response from service functions.
5. Unify logic of handling responses.
6. Separate business logic into multiple service functions, passing  information from one to another easily in the chain of middleware functions of the API. 


#### Functions. 

##### inject(func \[, pass, sources, defaults])
What injection does.
1. Looks into the arguments of the given function.
2. For each argument name, it looks for the value of the argument in the specified sources.
    - For example: if the function is ```addUser(email)``` the inject will look for the value of email in all sources.
    - If the value is not found, the defaults values are used instead, if no default is given or found, the value will be undefined.
    - If the argument's name is one of the 4 default injections: req, res, next, user, then req, res, next, req.user will be injected for that argument.
    - If the argument is one of the result handlers (explained later), the result handler function will be injected.
3. Calls the service function with the injected arguments.


Parameters: 

| Name | Type | Required? | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
| func | Function | Yes | N/A | Service function to be injected and called |
| pass | Boolean | No | false | If true, the middleware after this inject gets called, otherwise, the response is handled directly in the injected funciton |
| sources | Array  | No | ```es.prefs.middlewareHandler.sources``` | In what sources should
| defaults | Object | No | { } | If the value of an argument of the passed ```func``` is not found anywhere, a default is used instead if specified here. |


Injecting arguments after extraction, and parsing.

Create department service function.
```javascript
exports.addDepartment = function(data, handleResult){
    departmentsRepository.addDepartment(data, handleResult);
}
```

This is equivalent to the following (Without ES).
```javascript
exports.addDepartment = function(req,  res, next){
    let data =  {
        name: req.body.departmentName,
        description: req.body.description,
        purpose: req.body.purpose,
        parentDepartment: req.body.parentDepartment? new ObjectId(parentDepartment): undefined
    };

    departmentsRepository.addDepartment(data, function(err, response){
        if(err) return res.status(500).send(err);
        else if(!response) return res.status(500).send("Coudn't add department");

        return res.status(200).send(response);
    });
}
```


In the routing file, you add this:
```javascript

router.post('/departments/',    es.extractFromSchema("Department", false, true),
                                                    es.parse('parentDepartment', es.mappers.objectIdMapper),
                                                    es.inject(addDepartment));
```



#### Result Handlers.
They are functions injected  in service functions, which handle results and send appropriate responses.

Their purpose is to keep  the service functions clean and separate them from response handling logic, while also unifying resource handling logic in one place.

It's highly encouraged to write your own result handlers, according to your business logic, and keep them in  one file, attach them to Express  Steroid instance, and use them everywhere.

There are some important result handlers packaged with Express Steroid:

| Name | Arguments | behavior |
| ---- | --------- | -------- |
| handleResult | (err, response) | If  there's an error, it returns the error, if there's no response, it returns 404 and message ```prefs.errMessages.middlewareHandler.notFound```, otherwise the response is sent with status 200. If pass is set to true (in the inject function), it passes to the next middleware |
| respond | (err, response, status) | Doesn't pass to next, sends an error if there's one (response and status are ignored in this case), otherwise, sends the response with status (or 200 if status is not specified) |
| passToNext | (err, response) | If there's an error, it returns it. Otherwise,  it stores the response in the ```req[prefs.resultsObjName]``` and  passes  to next |

##### Result handlers signature
The following is a result handler signature, if you create a custom one it should follow it:
```resultHandler(req, res, next, pass, prefs)```

Where:

| Argument | Description |
| -------- | ----------- |
| req | ExpressJs req object |
| res | ExpressJs res object |
| next | ExpressJs next function |
| pass | value of ```pass``` argument in the inject function |
| prefs | ES preferences object |

##### Adding result handlers.
You can add your own result handlers, adhering to the signature specified [above](#result-handlers-signature).

To use your own result handlers, modify the preferences of ES: ```es.prefs.resultHandlers```, which is an object, the key of each resultHandler is the  name of the resultHandler, which is used in the argument of the injected function, and the value is the actual result handler function.

The object contains the resultHandlers that are injected, if you remove a default resultHandler from the object ```es.prefs.resultHandlers```, it will not be injected in any service function.


### ES preferences object.
 * As seen many times previously, you can modify Express Steroid library by changing the preferences.
 * You can access the preferences object using ```es.prefs```
 * When instantiating Express Steroid, you can pass preferences, any field that's left empty is substituted by the default preference value.

Default preferences.
Most of the following preferences are mentioned and explained previously, this section is just to document them in once place.


*Note: some fields in the following table are nested, the nesting is denoted by the .*

| Field | Default value | Description  |
| ----- | ------------- | -----------  |
| resultObjName | "results" | Where results are stored in ```req``` object when passing from one service function to another, using ```passToNext``` resultHandler |
| dataObjName | "data"  | Where data is stored by extraction methods |
| resultHandlers |  Object containing default handlers with their names: passToNext, respond, handleResult | Results handlers as specified [above](#result-handlers)
| middlewareHandler.sources | ```["data", "results", "queries"]``` | Sources  to look in when looking for values of arguments of injected function |
| middlewareHandler.defaultInjection | ```["user", "req", "res", "next"]``` | If any of those values are found as names of arguments in an injected function, the following will be injected instead (respectively): req, res, next, req.user |
| extractor.separator  | " " | Separator for parameters names of parameteres to be extracted|
| extractor.sources | ```["body", "query", "params"]``` | Sources to look in for the values of extracted parameters |
| extractor.ignoredFields | ```["_id", "__v"]``` | Default Ignored fields which are not extracted. If the user specified ignoredFields those will not be included |
| manipulator.sources | ```["data"]``` | Sources to look in for parameters to be parsed |
| manipulator.separator | " " | Separator for parameters names of parameters to be parsed |
| validator.sources | ```["data"]``` | Sources to look in for parameters to be validated |
| validator.separator | " " | Separator for parameters names of parameters to be validated |
| queryBuilder.sources |  ```["data"]``` | Sources to look in for parameters to be used for query building |
| queryBuilder.queriesObjName | "queries" | Name of the object in ```req``` to store queries in |
| errMessages | N/A |Contains Default error messages for each module in ES |


### HTTPError
A helper function which simply creates an object containing status and message.

```es.HTTPError(status, message)```


# Example Project
[Here](https://github.com/OmarKan/experss-steroid-example) you can find an example project, to see Express Steroid in action.


## Tests
First, ensure that Development dependencies are installed via NPM.

To run tests:
  
```sh  
npm test  
```  

## Motivation
Having developed around a dozen different backend apps using NodeJs, ExpressJs, and MongoDB, I found many patters of redundancy and some unnecessary difficulties when developing the typical NodeJs application.

I tried to eliminate such problems gradually over the years, which then motivated me to combine multiple ideas and solutions in a library that extends ExpressJs, and makes development way easier!

I tried this library on two live production projects, and I discovered that the ES really made development easier and more smoother, which further encouraged me to fully document it and publish it on NPM.

  
## Contribution  
Your contributions are encouraged and welcomed.

1. Fork.
2. Clone and install.
3. Develop.
4. Create tests, and add them to the test folder.
5. Pull request.


## Todo.
- [x] ~~Support for async Validators.~~
- [ ] Support for async Mappers.
- [ ] Later: Enhanced syntax (More self-evident).
- [ ] Later: Ability to develop query builders for other databases.

## Acknowledgements.
This library is heavily inspired by a similar one, named: [ExpressJs Plus](https://www.npmjs.com/package/expressjs-plus), developed by [Abdulrahman AlAmri](https://www.npmjs.com/~amri)
