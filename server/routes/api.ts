import Koa from 'koa';
import Router from 'koa-router';
import * as logger from '../utils/logger';
import * as parser from '../utils/parser';
import YouTube from '../services/youtube';

const router = new Router();

router.get('/', async (ctx: Koa.Context) => {
  const { url } = ctx.query;

  if (!url) {
    ctx.body = {
      ok: false,
      msg: 'url not found.'
    };

    return;
  }

  if (!parser.isValidURL(url)) {
    ctx.body = {
      ok: false,
      msg: 'invalid url.'
    };

    return;
  }

  const domainName: string = parser.getDomain(url);

  if (!parser.supported.includes(domainName)) {
    const errmsg: string = `${domainName} isn't supported.`;

    ctx.body = {
      ok: false,
      msg: errmsg
    };

    logger.error(errmsg);

    return;
  }

  try {
    const youtube = new YouTube(url);

    ctx.body = await youtube.getInfo();
  } catch (err) {
    logger.error(err);

    ctx.body = err;
  }
});

export default router;
