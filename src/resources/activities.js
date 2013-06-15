(function () {
  var Activities, ap;

  // Activites
  Activities = function (data) {
    this._attributes = JSON.parse(data);
  };
  ap = Activities.prototype;

  ap.get = function (attribute) {
    return this._attributes[attribute];
  };

  ap.stepCount = function () {
    return this.get('summary').steps;
  };

  // Browser
  if (typeof module === 'undefined') {
    window.Fitbit || (window.Fitbit = {});
    window.Fitbit.Activities = Activities;
  }
  // Node app
  else {
    module.exports = Activities;
  }

}())
