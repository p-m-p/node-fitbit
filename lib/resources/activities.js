// Dependencies
var Resource = require('./resource')
  , _ = require('lodash');

// Activites
// ---
//
// Model for activities resource
var Activities = Resource.extend({
  // Returns the step total from summary
  steps: function () {
    return this.getSummaryItem('steps');
  },

  // Returns the floors climbed from summary
  floors: function () {
    return this.getSummaryItem('floors');
  },

  // Returns the active score from summary
  activeScore: function () {
    return this.getSummaryItem('activeScore');
  },

  // Returns the total distance travelled
  totalDistance: function () {
    var total = _.find(this.getSummaryItem('distances'), {
      activity: 'total'
    });

    return total ? total.distance : 0;
  }
});

module.exports = Activities;