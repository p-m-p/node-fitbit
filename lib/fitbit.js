// Dependencies
var oauth = require('oauth')
  , _ = require('lodash');

// Resource Models
var resources = {
    Activities: require('./resources/activities')
  , Devices: require('./resources/devices')
  , Sleep: require('./resources/sleep')
  , Foods: require('./resources/foods')
};
// Includes all body resource Models
_.extend(resources, require('./resources/body'));

// API Endpoints
var endpoints = {
    // TODO allow user id for unauthenticated calls
    resources: 'https://api.fitbit.com/1/user/-/'
  , requestToken: 'https://api.fitbit.com/oauth/request_token'
  , accessToken: 'https://api.fitbit.com/oauth/access_token'
  , authorize: 'https://www.fitbit.com/oauth/authorize'
};

// API Client
// ---
//
// Constructor for a new API Client. `options.accessToken` and
// `options.accessTokenSecret` can be supplied for pre-authenticated users
var FitbitApiClient = function (consumerKey, consumerSecret, options) {
  options || (options = {});

  this._oauth = new oauth.OAuth(
      endpoints.requestToken
    , endpoints.accessToken
    , consumerKey
    , consumerSecret
    , '1.0'
    , null
    , 'HMAC-SHA1'
  );

  this.setUnitMeasure(options.unitMeasure);

  // Set authenticated user access token if set
  if (options.accessToken) {
    this.accessToken = options.accessToken;
    this.accessTokenSecret = options.accessTokenSecret;
  }
};

var cp = FitbitApiClient.prototype;
module.exports = FitbitApiClient;

// OAuth flow
// ---

// Fetches a request token and runs callback
cp.getRequestToken = function (extraParams, callback) {
  if (typeof extraParams === 'function') {
    callback = extraParams;
    extraParams = {};
  }

  this._oauth.getOAuthRequestToken(extraParams, callback);
};

// Returns the authorization url required for obtaining an access token
cp.authorizeUrl = function (requestToken) {
  return endpoints.authorize + '?oauth_token=' + requestToken;
};

// Fetches an access token and runs callback
cp.getAccessToken = function (token, tokenSecret, verifier, callback) {
  this._oauth.getOAuthAccessToken(token, tokenSecret, verifier, callback);
};

// Makes an authenticated call to the Fitbit API
cp.apiCall = function (url, callback) {
  var that = this;

  if (!this.accessToken || !this.accessTokenSecret) {
    throw new Error('Authenticate before making API calls');
  }

  this._oauth.get(url, this.accessToken, this.accessTokenSecret,
    function (err, data, response) {
      callback.call(that, err, data);
    });
};

// Resources
// ---

// Sets the Unit Measure type for all subsequent API calls
cp.setUnitMeasure = function (unitType) {
  if (!_.contains([null, void 0, 'en_US', 'en_GB'], unitType)) {
    throw new Error('Unit Measure type must be en_US, en_GB or null')
  }

  // Remove any previously set unit measure to reset to Metric
  if (unitType == null) {
    this._oauth.removeCustomHeader('Accept-Language');
  }
  // Set unit measure for all further request
  else {
    this._oauth.setCustomHeader('Accept-Language', unitType);
  }

  return this;
};

// Set up a `get[ResourceName]` method for each type of resource in `resources`
//
// Fetches the data for and returns the corresponding resource model object for
// each resource type on a given date set in `options`. If `options.date` is
// not supplied then activities for the current day will be supplied to
// `callback`
//
// `callback` parameters are `error`, `Resource` and `data` where `Resource`
// is a model resource object and data is the raw response data
_.each(resources, function (modelClass, modelName) {
  cp['get' + modelName] = function (options, callback) {
    this._getResource(modelName.toLowerCase(), modelClass, options, callback);
  };
});

// Generic method for fetching a resource
cp._getResource = function (type, Resource, options, callback) {
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }

  this.apiCall(
      helpers.resourceUrl(type, options.date)
    , function (err, data) {
        // Scope callbacks to undefined
        var ctx = void 0;

        if (err) {
          return callback.call(ctx, err);
        }

        callback.call(ctx, err, new Resource(JSON.parse(data)), data);
      }
  );
};

// Helpers
// ---
var helpers = {
  // Returns the API endpoint for a `resource` such as 'activities' or 'food'.
  // If `date` is not supplied todays date will be used.
  resourceUrl: function (resource, date) {
    var resourceSection = resource;
    date || (date = new Date);

    // Normalize the log resource types
    if (_.contains(['bodyweight', 'bodyfat', 'foods'], resource)) {
      resourceSection = resource
        .replace(/^(body|foods)(.*)$/, '$1/log/$2')
        .replace(/\/$/, '');
    }
    else if (resource === 'bodymeasurements') {
      resourceSection = 'body';
    }

    return (
      endpoints.resources +
      resourceSection +
      '/date/' +
      this.formatDate(date) + '.json'
    );
  },

  // Returns date formatted for making API calls.
  formatDate: function (date) {
    var day, month;

    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    month = date.getMonth() + 1;
    month < 10 && (month = '0' + month);
    day = date.getDate();
    day < 10 && (day = '0' + day);

    return date.getFullYear() + '-' + month + '-' + day;
  }
};
