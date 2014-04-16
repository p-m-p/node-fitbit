var Resource = require('./resource')
  , _ = require('lodash');

// Devices
// ---
//
// Model for devices resource
var Devices = Resource.extend({
  // Returns the step total from summary
  device: function (version) {
    return _.find(this._attributes, { deviceVersion: version });
  }
});

module.exports = Devices;
