module.exports = {
  activities: {
    "activities":[
      {
        "activityId":2050,
        "activityParentId":2050,
        "activityParentName":"Weight lifting (free weight, nautilus or universal-type), power lifting or body building, vigorous effort",
        "calories":364,
        "description":"",
        "duration":3000000,
        "hasStartTime":true,
        "isFavorite":false,
        "logId":27516995,
        "name":"Weight lifting (free weight, nautilus or universal-type), power lifting or body building, vigorous effort",
        "startTime":"19:10"
      }
    ],
    "goals":{
      "activeScore":1000,
      "caloriesOut":2520,
      "distance":8.05,
      "floors":40,
      "steps":10000
    },
    "summary":{
      "activeScore":649,
      "activityCalories":1021,
      "caloriesBMR":1756,
      "caloriesOut":2548,
      "distances":[
        {"activity":"total","distance":9.81},
        {"activity":"tracker","distance":9.81},
        {"activity":"loggedActivities","distance":0},
        {"activity":"veryActive","distance":2.72},
        {"activity":"moderatelyActive","distance":6.73},
        {"activity":"lightlyActive","distance":0.35},
        {"activity":"sedentaryActive","distance":0}
      ],
      "elevation":0,
      "fairlyActiveMinutes":103,
      "floors":0,
      "lightlyActiveMinutes":55,
      "marginalCalories":730,
      "sedentaryMinutes":1249,
      "steps":12448,
      "veryActiveMinutes":33
    }
  },

  sleep: {
    "sleep": [{
      "awakeningsCount":13,
      "duration":26760000,
      "efficiency":94,
      "isMainSleep":true,
      "logId":41050914,
      "minuteData":[
        {"dateTime":"23:10:00","value":"2"},
        {"dateTime":"23:11:00","value":"2"},
        {"dateTime":"23:12:00","value":"2"}
      ],
      "minutesAfterWakeup":0,
      "minutesAsleep":404,
      "minutesAwake":25,
      "minutesToFallAsleep":17,
      "startTime":"2013-06-18T23:10:00.000",
      "timeInBed":446
    }],
    "summary":{
      "totalMinutesAsleep":404,
      "totalSleepRecords":1,
      "totalTimeInBed":446
    }
  },

  devices: [
    {
      "battery":"High",
      "id":"123456",
      "lastSyncTime":"2011-08-26T11:19:03.000",
      "type":"TRACKER",
      "deviceVersion":"Ultra"
    },
    {
      "battery":"Full",
      "id":"123457",
      "lastSyncTime":"2011-08-26T11:19:03.000",
      "type":"TRACKER",
      "deviceVersion":"Flex"
    }
  ],

  // Return the data as a raw string
  raw: function (fixture) {
    return JSON.stringify(this[fixture]);
  }
};
