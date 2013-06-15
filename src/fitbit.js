// Dependencies
var OAuth = require('OAuth');

// Resources
var Activities = require('./resources/activities');

// API Endpoints
var endpoints = {
    resources: 'http://api.fitbit.com/1/user/-/'
  , requestToken: 'http://api.fitbit.com/oauth/request_token'
  , accessToken: 'http://api.fitbit.com/oauth/access_token'
  , authorize: 'http://www.fitbit.com/oauth/authorize'
};

// API Client
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

  this.accessToken = accessToken;
  this.accessTokenSecret = accessTokenSecret;
}

var cp = FitbitApiClient.prototype;

// OAuth flow
// ---
cp.getRequestToken = function (response, callback) {
  var that = this;

  this._oauth.getOAuthRequestToken(function (err, token, secret) {
    // TODO check for and handle error
    callback.call(undefined, token, secret);
  });
};

cp.authorizeUrl = function (requestToken) {
  return endpoints.authorize + '?oauth_token=' + requestToken;
};

cp.getAccessToken = function (token, tokenSecret, verifier, callback) {
  this._oauth.getOAuthAccessToken(
      token
    , tokenSecret
    , verifier
    , function (err, accessToken, accessTokenSecret, results) {
        // TODO handle error
        callback.call(undefined, accessToken, accessTokenSecret);
      }
  );
};

cp._apiCall = function (url, callback) {
  var that = this;

  if (!this.accessToken || !this.accessTokenSecret) {
    throw new Error('Authenticate before making API calls')
  }

  this._oauth.get(
      url
    , this.accessToken
    , this.accessTokenSecret
    , function (err, data, response) {
        callback.call(that, err, data);
      }
  );
};

// Resources
// ---
cp.getActivities = function (options, callback) {
  this._apiCall(
      endpoints.resources + 'activities/date/2013-06-04.json'
    , function (err, data) {
        // TODO check error
        callback.call(new Activities(data), data)
      }
  );
};

module.exports = FitbitApiClient;
