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
		//this._attributes;
		var device = null;

		_.forEach(this._attributes, function(d) {
			if (d.deviceVersion == x) device = d;
		});

		return device;
	}
});

module.exports = Devices;
