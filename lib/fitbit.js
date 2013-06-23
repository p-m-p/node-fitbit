// Dependencies
var OAuth = require('OAuth')
  , _ = require('lodash');

// Resource Models
var resources = {
    Activities: require('./resources/activities')
  , Sleep: require('./resources/sleep')
};
// Includes all body resource Models
_.extend(resources, require('./resources/body'));

// API Endpoints
var endpoints = {
    // TODO allow user id for unauthenticated calls
    resources: 'http://api.fitbit.com/1/user/-/'
  , requestToken: 'http://api.fitbit.com/oauth/request_token'
  , accessToken: 'http://api.fitbit.com/oauth/access_token'
  , authorize: 'http://www.fitbit.com/oauth/authorize'
};

// API Client
// ---
//
// Constructor for a new API Client. `accessToken` and `accessTokenSecret`
// are only required for pre-authenticated users
var FitbitApiClient = function (
    consumerKey
  , consumerSecret
  , accessToken
  , accessTokenSecret
) {
  this._oauth = new OAuth.OAuth(
      endpoints.requestToken
    , endpoints.accessToken
    , consumerKey
    , consumerSecret
    , '1.0'
    , null
    , 'HMAC-SHA1'
  );

  // TODO add locale for unit measures

  // Set authenticated user access token if set
  this.accessToken = accessToken;
  this.accessTokenSecret = accessTokenSecret;
};

var cp = FitbitApiClient.prototype;
module.exports = FitbitApiClient;

// OAuth flow
// ---

// Fetches a request token and runs callback
cp.getRequestToken = function (callback) {
  this._oauth.getOAuthRequestToken(callback);
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

    // Normalize the body resource types
    if (_.contains(['bodyweight', 'bodyfat'], resource)) {
      resourceSection = 'body/log/' + resource.replace('body', '');
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
