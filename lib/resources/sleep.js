// Dependencies
var Resource = require('./resource');

// Activites
// ---
//
// Model for activities resource
var Sleep = Resource.extend({
  // Returns the total amount of time in bed
  timeInBed: function () {
    return this.getSummaryItem('totalTimeInBed');
  },

  // Returns the total amount of time asleep in minutes
  minutesAsleep: function () {
    return this.getSummaryItem('totalMinutesAsleep');
  },

  // Returns the total amount of time asleep in hours
  hoursAndMinutesAsleep: function () {
    var mins = this.minutesAsleep();

    return {
        hours: Math.floor(mins / 60)
      , mins: mins % 60
    };
  }
});

module.exports = Sleep;
