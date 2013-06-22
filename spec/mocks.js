var noop = function () {}
  , OAuth = function () {};

OAuth.prototype.getOAuthRequestToken = noop;
OAuth.prototype.getOAuthAccessToken = noop;

module.exports = {
  OAuth: { OAuth: OAuth }
};
