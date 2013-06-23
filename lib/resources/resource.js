var _ = require('lodash');

var Resource = function (data) {
  this._attributes = data;
};

Resource.prototype = {
  // Returns a specific attribute
  get: function (attribute) {
    return this._attributes[attribute];
  },

  // Returns `item` from the summary
  getSummaryItem: function (item) {
    var summary = this.get('summary');

    if (summary) {
      return summary[item];
    }

    throw new Error('Resource does not contain summary data');
  }
};

// Creates a new resource type by extending the base resource
Resource.extend = function (props) {
  var parent = this
    , child = function () { return parent.apply(this, arguments); }
    , tmp = function () { this.constructor = child; };

  tmp.prototype = parent.prototype;
  child.prototype = new tmp;
  _.extend(child.prototype, props);

  return child;
};

module.exports = Resource;
