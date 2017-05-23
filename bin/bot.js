#!/usr/bin/env node

/**
 * telegram-weather
 * to start: TELEGRAM_WEATHER_API_KEY=<TelegramAPIkey> npm start
 * where TELEGRAM_WEATHER_API_KEY is authentication token to allow the bot to live
 */

'use strict';

const config = require('config');
const WeatherBot = require('../lib/weatherBot');

const token = process.env.TELEGRAM_WEATHER_API_KEY || config.get( 'token' )

const bot = new WeatherBot(token, {polling: true});

bot.on('message', bot._onMessage);
