describe('Fitbit API Client', function () {
  var loader = require('./module-loader')
    , sinon = require('sinon')
    , mocks = require('./mocks')
    , FitbitModule = loader.loadModule(__dirname + '/../src/fitbit.js', {
        OAuth: mocks.OAuth
      })
    , authProto = mocks.OAuth.OAuth.prototype
    , client;

  describe('authentication flow', function () {
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

    it('should return the authorization url', function () {
      expect(client.authorizeUrl('token'))
        .toBe('http://www.fitbit.com/oauth/authorize?oauth_token=token');
    });

    it('should get an access token', function () {
      var callback = sinon.spy();
      sinon.stub(authProto, 'getOAuthAccessToken', function (r, rs, v, cb) {
        expect(r).toBe('requestToken');
        expect(rs).toBe('requestTokenSecret');
        expect(v).toBe('verifier');

        cb.call(void 0, null, 'token', 'tokenSecret');
      });
      client.getAccessToken(
          'requestToken'
        , 'requestTokenSecret'
        , 'verifier'
        , callback
      );

      expect(callback.calledWith(null, 'token', 'tokenSecret')).toBe(true);
      authProto.getOAuthAccessToken.restore();
    });

    it('should error trying to make an unauthorized API call', function () {
      try {
        client.apiCall('http://api.endpoint', function () {});
      }
      catch (ex) {
        expect(ex.message).toBe('Authenticate before making API calls');
      }
    });
  });

  describe('when authenticated', function () {
    beforeEach(function () {
      client = new FitbitModule.FitbitApiClient(
          'consumerKey'
        , 'consumerSecret'
        , 'accessToken'
        , 'accessTokenSecret'
      );
    });

    it('should make an API call', function () {
      var callback = sinon.spy()
        , data = '{ "data": ["one", "two", "three"] }';
      sinon.stub(authProto, 'get', function (u, t, ts, cb) {
        expect(u).toBe('http://api.endpoint');
        expect(t).toBe('accessToken');
        expect(ts).toBe('accessTokenSecret');

        cb.call(void 0, null, data);
      });
      client.apiCall('http://api.endpoint', callback);

      expect(callback.calledWith(null, data)).toBe(true);
      expect(callback.calledOn(client)).toBe(true);
    });
  });
});
