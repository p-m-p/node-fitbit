describe('Fitbit API Client', function () {
  var loader = require('./module-loader')
    , sinon = require('sinon')
    , mocks = require('./mocks')
    , fixtures = require('./fixtures')
    , FitbitModule = loader.loadModule(__dirname + '/../lib/fitbit.js', {
        oauth: mocks.oauth
      })
    , authProto = mocks.oauth.OAuth.prototype
    , helpers = FitbitModule.helpers
    , client;

  describe('authentication flow', function () {
    beforeEach(function () {
      client = new FitbitModule.FitbitApiClient(
          'consumerKey'
        , 'consumerSecret'
      );
    });

    it('should get a request token', function () {
      var callback = sinon.spy();
      sinon.stub(authProto, 'getOAuthRequestToken', function (extra, cb) {
        cb.call(void 0, null, 'token', 'tokenSecret');
      });
      client.getRequestToken(callback);

      expect(callback.calledWith(null, 'token', 'tokenSecret')).toBe(true);
      authProto.getOAuthRequestToken.restore();
    });

    it('should return the authorization url', function () {
      expect(client.authorizeUrl('token'))
        .toBe('https://www.fitbit.com/oauth/authorize?oauth_token=token');
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
        client.apiCall('https://api.endpoint', function () {});
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
        , {
              accessToken: 'accessToken'
            , accessTokenSecret: 'accessTokenSecret'
          }
      );
    });

    it('should set the unit measure', function () {
      var oa = client._oauth;
      sinon.stub(authProto, 'setCustomHeader');
      sinon.stub(authProto, 'removeCustomHeader');

      expect(client.setUnitMeasure('en_GB')).toBe(client);
      expect(oa.setCustomHeader.calledWithExactly('Accept-Language', 'en_GB'))
        .toBe(true);

      oa.setCustomHeader.reset();
      expect(client.setUnitMeasure('en_US')).toBe(client);
      expect(oa.setCustomHeader.calledWithExactly('Accept-Language', 'en_US'))
        .toBe(true);

      oa.setCustomHeader.reset();
      expect(client.setUnitMeasure(null)).toBe(client);
      expect(oa.setCustomHeader.called).toBe(false);
      expect(oa.removeCustomHeader.calledWithExactly('Accept-Language'))
        .toBe(true);

      oa.removeCustomHeader.reset();
      expect(client.setUnitMeasure()).toBe(client);
      expect(oa.setCustomHeader.called).toBe(false);
      expect(oa.removeCustomHeader.calledWithExactly('Accept-Language'))
        .toBe(true);

      try {
        client.setUnitMeasure('parp');
      }
      catch (ex) {
        expect(ex.message).toBe('Unit Measure type must be en_US, en_GB or null');
      }
    });

    it('should make an API call', function () {
      var callback = sinon.spy()
        , data = '{ "data": ["one", "two", "three"] }';
      sinon.stub(authProto, 'get', function (u, t, ts, cb) {
        expect(u).toBe('https://api.endpoint');
        expect(t).toBe('accessToken');
        expect(ts).toBe('accessTokenSecret');

        cb.call(void 0, null, data);
      });
      client.apiCall('https://api.endpoint', callback);

      expect(callback.calledWith(null, data)).toBe(true);
      expect(callback.calledOn(client)).toBe(true);
      authProto.get.restore();
    });

    it('should fetch activities for a day', function () {
      var callback = sinon.spy()
        , data = fixtures.raw('activities');
      sinon.stub(authProto, 'get', function (u, t, ts, cb) {
        expect(u).toBe('https://api.fitbit.com/1/user/-/activities/date/2013-06-23.json');

        cb.call(void 0, null, data);
      });
      client.getActivities({date: '2013-06-23'}, callback);

      expect(callback.calledOn(void 0)).toBe(true);
      expect(callback.args[0][1] instanceof FitbitModule.resources.Activities).toBe(true);
      expect(callback.args[0][2]).toBe(data);
      authProto.get.restore();
    });

    it('should fetch activities without options', function () {
      var callback = sinon.spy()
        , data = fixtures.raw('activities')
        , today = helpers.formatDate(new Date);
      sinon.stub(authProto, 'get', function (u, t, ts, cb) {
        expect(u).toBe('https://api.fitbit.com/1/user/-/activities/date/' + today + '.json');

        cb.call(void 0, null, data);
      });
      client.getActivities(callback);

      expect(callback.calledOn(void 0)).toBe(true);
      expect(callback.args[0][1] instanceof FitbitModule.resources.Activities).toBe(true);
      expect(callback.args[0][2]).toBe(data);
      authProto.get.restore();
    });

    it('should fail to fetch activities', function () {
      var callback = sinon.spy()
        , error = new Error('Failed to load activities');
      sinon.stub(authProto, 'get', function (u, t, ts, cb) {
        cb.call(void 0, error);
      });
      client.getActivities(callback);

      expect(callback.calledOn(void 0)).toBe(true);
      expect(callback.calledWithExactly(error)).toBe(true);
      authProto.get.restore();
    });

    it('should fetch sleep for a day', function () {
      var callback = sinon.spy()
        , data = fixtures.raw('sleep');
      sinon.stub(authProto, 'get', function (u, t, ts, cb) {
        expect(u).toBe('https://api.fitbit.com/1/user/-/sleep/date/2013-06-23.json');

        cb.call(void 0, null, data);
      });
      client.getSleep({date: '2013-06-23'}, callback);

      expect(callback.calledOn(void 0)).toBe(true);
      expect(callback.args[0][1] instanceof FitbitModule.resources.Sleep).toBe(true);
      expect(callback.args[0][2]).toBe(data);
      authProto.get.restore();
    });

    it('should fetch sleep without options', function () {
      var callback = sinon.spy()
        , data = fixtures.raw('sleep')
        , today = helpers.formatDate(new Date);
      sinon.stub(authProto, 'get', function (u, t, ts, cb) {
        expect(u).toBe('https://api.fitbit.com/1/user/-/sleep/date/' + today + '.json');

        cb.call(void 0, null, data);
      });
      client.getSleep(callback);

      expect(callback.calledOn(void 0)).toBe(true);
      expect(callback.args[0][1] instanceof FitbitModule.resources.Sleep).toBe(true);
      expect(callback.args[0][2]).toBe(data);
      authProto.get.restore();
    });

    it('should fail to fetch sleep', function () {
      var callback = sinon.spy()
        , error = new Error('Failed to load sleep');
      sinon.stub(authProto, 'get', function (u, t, ts, cb) {
        cb.call(void 0, error);
      });
      client.getSleep(callback);

      expect(callback.calledOn(void 0)).toBe(true);
      expect(callback.calledWithExactly(error)).toBe(true);
      authProto.get.restore();
    });
  });

  describe('helper methods', function () {
    it('should format a date', function () {
      expect(helpers.formatDate('Sun Jun 23 2013')).toBe('2013-06-23');
      expect(helpers.formatDate('Sun Jun 8 2013')).toBe('2013-06-08');
      expect(helpers.formatDate(new Date('Sun Jun 8 2013'))).toBe('2013-06-08');
    });

    it('should return a resource url', function () {
      var today = helpers.formatDate(new Date);

      expect(helpers.resourceUrl('sleep', 'Sun Jun 23 2013'))
        .toBe('https://api.fitbit.com/1/user/-/sleep/date/2013-06-23.json');
      expect(helpers.resourceUrl('activities'))
        .toBe('https://api.fitbit.com/1/user/-/activities/date/' + today + '.json');
      expect(helpers.resourceUrl('bodyweight', 'Sun Oct 1 2013'))
        .toBe('https://api.fitbit.com/1/user/-/body/log/weight/date/2013-10-01.json');
      expect(helpers.resourceUrl('bodymeasurements', 'Sun Oct 13 2013'))
        .toBe('https://api.fitbit.com/1/user/-/body/date/2013-10-13.json');
      expect(helpers.resourceUrl('bodyfat', 'Sun Aug 21 2009'))
        .toBe('https://api.fitbit.com/1/user/-/body/log/fat/date/2009-08-21.json');
      expect(helpers.resourceUrl('foods'))
        .toBe('https://api.fitbit.com/1/user/-/foods/log/date/' + today + '.json');
    });
  });
});
