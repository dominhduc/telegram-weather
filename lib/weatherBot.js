'use strict';
console.log('weatherBot for Telegram');

const TelegramBot = require('node-telegram-bot-api');
const CronJob = require('cron').CronJob;

const data = require('./modules/datastore');
const weather = require('./modules/weather');

const emoji = require('./emoji/Telegram.json');

let users = data.loadUsers();
let cronJobs = {};

class weatherBot extends TelegramBot {

  constructor(token, options) {
    super(token, options);

    Object.keys(users).forEach((chatId) => {
      let user = users[chatId];
      if(user.cron && user.city) {
        this._createCron(chatId, user.city, user.cron);
        console.log(`update cron for ${user.first_name}: city ${user.city} each ${user.cron}`);
      }
    });
  }

  _createCron(chatId, city, cronTime) {
    const _this = this;
    cronJobs[chatId] = new CronJob(cronTime, () => {
      weather.weatherByCity(city, emoji, ( err, data ) => {
        _this.sendMessage( chatId, data, {as_user: true} )
      })
    }, () => {}, true);
  }

  _onMessage(message) {
    const _this = this;
    const chatId = message.chat.id;
    const city = message.text;
    let user = users[chatId];

    const clock = city.match(/^(remind|at|clock|alarm|memory)?\s*(\d{2}):(\d{2})/);
    if( clock ) {
      user.cron = `02 ${clock[3]} ${clock[2]} * * *`;
      this._createCron(chatId, user.city, user.cron);
      _this.sendMessage( chatId, `set cron to ${clock[2]}:${clock[3]}`, {as_user: true} )
      data.saveUsers(users);
    } else {
      if(!user) user = message.from;
      if( user.city !== city ) {
        user.city = city;
        data.saveUsers(users);
      }
      weather.weatherByCity( city, emoji, ( err, data ) => {
        _this.sendMessage( chatId, data, {as_user: true} )
      })
    }

  }
}

module.exports = weatherBot;
