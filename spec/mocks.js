var noop = function () {}
  , OAuth = function () {};

OAuth.prototype.getOAuthRequestToken =
OAuth.prototype.getOAuthAccessToken =
OAuth.prototype.get =
OAuth.prototype.setCustomHeader =
OAuth.prototype.removeCustomHeader =
  noop;

module.exports = {
  oauth: { OAuth: OAuth }
};
