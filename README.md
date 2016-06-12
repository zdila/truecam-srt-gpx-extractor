## About

Tool for creating GPX from TrueCam video subtitles.

## Prerequisites

* node.js (with npm)
* ffmpeg

## Instructions

1. extract subtitles with `ffmpeg -i AMBA####.MOV -map 0:s:0 subs.srt`
2. download dependencies with `npm install`
3. create GPX with `node index.js < subs.srt > out.gpx`

## Uploading to Mapillary

Mapillary has size limit 2.5 GB and format mp4. To split and convert the file run `ffmpeg -y -i AMBA####.MOV -vcodec copy -acodec copy -ss 00:00:00 -t 00:15:00 -sn out1.mp4 -vcodec copy -acodec copy -ss 00:15:00 -t 01:00:00 -sn out2.mp4`.
