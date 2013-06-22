describe('Fitbit API Client', function () {
  var loader = require('./module-loader')
    , sinon = require('sinon')
    , mocks = require('./mocks')
    , FitbitModule = loader.loadModule(__dirname + '/../src/fitbit.js', {
        OAuth: mocks.OAuth
      })
    , client;

  describe('authentication flow', function () {
    var authProto = mocks.OAuth.OAuth.prototype;

    beforeEach(function () {
      client = new FitbitModule.FitbitApiClient('consumerKey', 'consumerSecret');
    });

    it('should get a request token', function () {
      var callback = sinon.spy();
      sinon.stub(authProto, 'getOAuthRequestToken', function (cb) {
        cb.call(void 0, null, 'token', 'tokenSecret');
      });
      client.getRequestToken(callback);

      expect(callback.calledWith(null, 'token', 'tokenSecret')).toBe(true);
      authProto.getOAuthRequestToken.restore();
    });
  });
});
