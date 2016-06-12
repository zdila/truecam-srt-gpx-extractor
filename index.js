'use strict';

const parser = require('subtitles-parser');
const moment = require('moment');
const builder = require('xmlbuilder');

let srt = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    srt += chunk;
  }
});

process.stdin.on('end', () => {
  const data = parser.fromSrt(srt);

  const re = /\}A,(\d+),(\d+\.\d+),([+-]?\d\d)(\d+\.\d+),(N),([+-]?\d\d\d)(\d+\.\d+),(E),([+-]?\d+.\d+),([+-]?\d+\.\d+),([+-]?\d+\.\d+),([+-]?\d+\.\d+);/;

  const gpx = builder.create('gpx').att({xmlns: 'http://www.topografix.com/GPX/1/1', version: '1.1'});

  const trk = gpx.ele('trk');
  const trkseg = trk.ele('trkseg');

  data.forEach(item => {
      const m = re.exec(item.text);
      if (m) {
          const trkpt = trkseg.ele('trkpt');
          trkpt.att({
              lat: (m[5] === 'N' ? 1 : -1) * (parseFloat(m[3]) + parseFloat(m[4]) / 60),
              lon: (m[8] === 'E' ? 1 : -1) * (parseFloat(m[6]) + parseFloat(m[7]) / 60)
          });
          trkpt.ele('time', moment(m[1] + m[2], 'YYMMDDHHmmss.SSS').format());
          trkpt.ele('speed', parseFloat(m[9]) * 1.60934);
      } else {
          console.error(item.text);
      }
  });

  console.log(gpx.end({ pretty: true }));
});
