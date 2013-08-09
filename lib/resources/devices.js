// Dependencies
var Resource = require('./resource')
  , _ = require('lodash');

// Activites
// ---
//
// Model for activities resource
var Devices = Resource.extend({
  // Returns the step total from summary
  device: function (x) {
  	return this._attributes[x];
  }
});

module.exports = Devices;
