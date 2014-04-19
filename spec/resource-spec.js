describe('Resources', function () {
  var libPath = __dirname + '/../lib/resources/'
    , Resource = require(libPath + 'resource')
    , Activities = require(libPath + 'activities')
    , Sleep = require(libPath + 'sleep')
    , Devices = require(libPath + 'devices')
    , fixtures = require('./fixtures');

  describe('base resource', function () {
    var base;

    beforeEach(function () {
      base = new Resource({"rootItem": "Hello world!", "summary": {"one": 1}});
    });

    it('should get an attribute', function () {
      expect(base.get('rootItem')).toBe('Hello world!');
    });

    it('should get a summary item', function () {
      expect(base.getSummaryItem('one')).toBe(1);
    });
  });

  describe('activities', function () {
    var activities;

    beforeEach(function () {
      activities = new Activities(fixtures.activities);
    });

    it('should return steps', function () {
      expect(activities.steps()).toBe(12448);
    });

    it('should return floors', function () {
      expect(activities.floors()).toBe(0);
    });

    it('should return active score', function () {
      expect(activities.activeScore()).toBe(649);
    });

    it('should return total distance', function () {
      expect(activities.totalDistance()).toBe(9.81);
    });
  });

  describe('sleep', function () {
    var sleep;

    beforeEach(function () {
      sleep = new Sleep(fixtures.sleep);
    });

    it('should return time in bed', function () {
      expect(sleep.timeInBed()).toBe(446);
    });

    it('should return number of minutes asleep', function () {
      expect(sleep.minutesAsleep()).toBe(404);
    });

    it('should return hours and minutes asleep', function () {
      expect(sleep.hoursAndMinutesAsleep()).toEqual({
          hours: 6
        , mins: 44
      });
    });
  });

  describe('devices', function () {
    var devices;

    beforeEach(function () {
      devices = new Devices(fixtures.devices);
    });

    it('should return the correct device version', function () {
      expect(devices.device('Flex').id).toBe('123457');
    });
  });
});
