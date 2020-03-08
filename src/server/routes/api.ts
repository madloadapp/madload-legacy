import express from 'express';
import logger from '../lib/utils/logger';
import * as urlParser from '../lib/utils/url-parser';

const router: express.Router = express.Router();

const supported: string[] = [
  'youtube.com',
  'youtu.be',
  'soundcloud.com',
  'twitter.com',
  'facebook.com',
  'instagram.com'
];

router.post('/', (req: express.Request, res: express.Response) => {
  const url: string = req.body.url;

  if (!url) {
    return res.json({
      ok: false,
      msg: 'url not found.'
    });
  }

  if (!urlParser.isValidURL(url)) {
    return res.json({
      ok: false,
      msg: 'invalid url.'
    });
  }

  const domainName = urlParser.getDomain(url);

  if (!supported.includes(domainName)) {
    const errmsg = `${domainName} isn't supported.`;

    res.json({
      ok: false,
      msg: errmsg
    });
    return logger.error(errmsg);
  }
});

export default router;
