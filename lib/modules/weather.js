'use strict';

const climate = require('city-weather');
const async = require('async');

exports.weatherByCity = (cityName, emojiData, callback) => {
  if (!cityName) {
    callback('No city name!');
  } else {
    async.parallel([
      (cb) => {
        climate.getActualTemp(cityName, (temperature) => {
          cb(null, temperature);
        });
      },

      (cb) => {
        climate.getClimateDescription(cityName, (description) => {
          cb(null, description);
        });
      },

      (cb) => {
        climate.getWindSpeed(cityName, (speed) => {
          cb(null, speed);
        });
      },
    ],
    (err, res) => {
      let emoji =
          ( res[1].match( /clear/i ) )? emojiData.clear
        : ( res[1].match( /(broken clouds)|(scattered clouds)/i ) )? emojiData.brokenClouds
        : ( res[1].match( /shower rain/i ) )? emojiData.showerRain
        : ( res[1].match( /clouds/i ) )? emojiData.clouds
        : ( res[1].match( /snow/i ) )? emojiData.snow
        : ( res[1].match( /rain/i ) )? emojiData.rain
        : '';

      callback(err, `Today in ${cityName} ${emoji} ${res[0]}°C, ${res[1]}, wind ${res[2]}m/s`);
    });
  }
};

