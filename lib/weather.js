/**
 * 明日の天気と気温を取得する
 */
const util = require('util');
const http = require('thip');
const xml2js = require('xml2js');

const parser = util.promisify(xml2js.parseString);

const weatherApiUrl = 'http://rss.weather.yahoo.co.jp/rss/days/4410.xml';

const replaceEmoji = [
  [/晴れ?/, ':sunny:'],
  [/曇り?/, ':cloud:'],
  [/雨/, ':umbrella:'],
  [/雪/, ':snowflake:'],
  [/時々/, '/'],
  [/後/, '→'],
];

// '晴れ - 4℃/-1℃' → { weather: '晴れ', max: 4, min: -1 }
function parseWeather(str) {
  const match = str.match(/^(.+) - (-?\d+)℃\/(-?\d+)℃$/);
  return {
    weather: match[1],
    max: parseInt(match[2], 10),
    min: parseInt(match[3], 10),
  };
}

function diff2str(d) {
  if (d === 0) return `±${d}`;
  if (d > 0) return `+${d}`;
  return `${d}`;
}

function formatWeather(w) {
  return `${w.emoji} ${w.max}℃/${w.min}℃ (前日比${diff2str(w.diffMax)}℃/${diff2str(w.diffMin)}℃)`;
}

function getTomorrowWeather() {
  return http.get(weatherApiUrl)
    .then(res => parser(res.body))
    .then((res) => {
      const item = res.rss.channel[0].item;
      const today = parseWeather(item[0].description[0]);
      const tomorrow = parseWeather(item[1].description[0]);
      tomorrow.diffMax = tomorrow.max - today.max;
      tomorrow.diffMin = tomorrow.min - today.min;
      tomorrow.diffMaxStr = diff2str(tomorrow.diffMax);
      tomorrow.diffMinStr = diff2str(tomorrow.diffMin);
      tomorrow.emoji = replaceEmoji.reduce((w, e) => w.replace(...e), tomorrow.weather);
      tomorrow.description = formatWeather(tomorrow);
      return Promise.resolve(tomorrow);
    });
}

module.exports = getTomorrowWeather;
