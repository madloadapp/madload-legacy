const router = require('express').Router();
const ytdl = require('youtube-dl');
const logger = require('../lib/logger');

const supported = [
  'youtube.com',
  'youtu.be',
  'soundcloud.com',
  'twitter.com',
  'facebook.com',
  'instagram.com'
];

router.post('/', (req, res) => {
  const url = req.body.url || req.query.url;

  if (!url) return res.json({ ok: false, err: 'url not found.' });

  let urlMatch = url.match(/^(https?:\/\/){0,1}(www\.){0,1}[\d-.a-z]+\.[a-z]{2,5}\.{0,1}/i);
  if (urlMatch && urlMatch.length > 0) {
    let domainName = urlMatch[0].replace(/(https?:\/\/){0,1}(www\.){0,1}/i, '');
    if (!supported.includes(domainName)) {
      let errmsg = `${domainName} isn't supported.`;

      res.json({
        ok: false,
        err: errmsg
      });
      return logger('error', errmsg);
    }
  }

  ytdl.getInfo(url, (err, info) => {
    if (err) {
      res.json({
        ok: false,
        err: 'error occurred when getting info.'
      });
      return logger('error', err);
    }

    const data = {
      ok: true,
      id: info.display_id,
      title: info.title,
      url: info.webpage_url,
      platform: info.extractor,
      thumbnail: info.thumbnail,
      author: {
        name: info.uploader
      },
      formats: []
    };

    // handling author url
    if (info.uploader_url) {
      data.author.url = info.uploader_url;
    } else if (info.uploader_id) {
      data.author.url = `${urlMatch[0]}/${info.uploader_id}`;
    } else {
      data.author.url = info.webpage_url.match(
        /^(https?:\/\/){0,1}(www\.){0,1}[\d-.a-z]+\.[a-z]{2,5}\/[\d-.a-z]+/i
      )[0];
    }

    // handling duration
    if (info.duration) {
      if (info.duration.includes(':')) {
        data.duration = info.duration
          .split(':')
          .map(t => (t < 10 ? `0${~~t}` : ~~t))
          .join(':');
      } else {
        data.duration = `00:${info.duration < 10 ? `0${~~info.duration}` : ~~info.duration}`;
      }
    }

    if (data.platform !== 'soundcloud' && data.platform !== 'instagram') {
      data.formats = info.formats
        .map(item => {
          return {
            url: item.url,
            ext: item.ext,
            acodec: item.acodec,
            vcodec: item.vcodec,
            format:
              item.format &&
              item.format.startsWith(item.format_id) &&
              item.format.replace(`${item.formatId} - `, '').trim(),
            formatId: item.format_id,
            formatNote: item.format_note
          };
        })
        .filter(item => {
          if (data.platform === 'youtube') {
            // remove DASH videos/audios
            if (item.formatNote.startsWith('DASH')) return false;

            // remove audio only videos
            if (
              (item.ext === 'mp4' || item.ext === 'webm') &&
              (item.formatNote === 'tiny' || item.vcodec === 'none')
            )
              return false;
          } else if (data.platform === 'twitter') {
            // remove HLS videos
            if (item.formatId.startsWith('hls')) return false;
          } else if (data.platform === 'facebook') {
            // remove DASH videos
            if (item.ext === 'mp4') {
              if (item.formatNote && item.formatNote.startsWith('DASH')) return false;
              if (info.format_id.includes('no_ratelimit')) {
                if (!info.format_id.includes('no_ratelimit')) return false;
              }
            }
          }

          return true;
        })
        .sort((a, b) => {
          if (data.platform === 'youtube') {
            // sort by formatNote (1080p, 720p, etc..)
            return parseInt(a.formatNote, 10) > parseInt(b.formatNote, 10) ? -1 : 1;
          }

          if (data.platform === 'twitter') {
            // sort by resolution (720x1280, 360x640, etc..)
            let ax = a.format.split('x');
            let bx = b.format.split('x');
            return bx[1] - bx[0] - (ax[1] - ax[0]);
          }

          return 0;
        });

      if (data.platform === 'youtube') {
        // set thumbnail
        data.thumbnail = data.thumbnail.replace('hqdefault', 'mqdefault');

        // move best formats up
        let formatMedium = data.formats.findIndex(item => item.formatId === '18');
        let formatHigh = data.formats.findIndex(item => item.formatId === '22');

        if (formatMedium !== -1) data.formats.unshift(data.formats.splice(formatMedium, 1)[0]);
        if (formatHigh !== -1) data.formats.unshift(data.formats.splice(formatHigh, 1)[0]);

        // move the audio up if its a music video
        if (info.categories.includes('Music')) {
          data.formats.unshift(
            data.formats.splice(
              data.formats.findIndex(item => item.ext === 'm4a'),
              1
            )[0]
          );
        }
      }
    } else {
      data.formats[0] = {
        url: info.url,
        ext: info.ext
      };

      if (data.platform === 'soundcloud') data.thumbnail = data.thumbnail.replace('original', 'crop');
    }

    res.json(data);
  });
});

if (process.env.NODE_ENV === 'development') {
  router.all('/test', (req, res) => {
    ytdl.getInfo(req.query.url, (err, info) => {
      res.json(info);
    });
  });
}

module.exports = router;
