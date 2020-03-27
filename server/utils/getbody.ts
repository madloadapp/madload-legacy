import http from 'http';
import https from 'https';
import { parse as urlParse } from 'url';

export interface GetBodyResponse {
  data: string;
  headers: http.IncomingHttpHeaders;
  status?: number;
  statusText?: string;
}

export type GetBodyOptions = http.RequestOptions & https.RequestOptions;

function getbody(
  url: string,
  opts: GetBodyOptions = {}
): Promise<GetBodyResponse> {
  return new Promise((resolve, reject) => {
    let data: string = '';

    const resHandler = (res: http.IncomingMessage): void => {
      res.on('data', chunk => {
        data += chunk;
      });

      res.on('error', err => {
        reject(err);
      });

      res.on('end', () => {
        resolve({
          data,
          headers: res.headers,
          status: res.statusCode,
          statusText: res.statusMessage
        });
      });
    };

    const { protocol } = urlParse(url);

    if (protocol === 'https:') {
      https.get(url, opts, resHandler);
    } else if (protocol === 'http:') {
      http.get(url, opts, resHandler);
    } else {
      reject('support only http or https protocols');
    }
  });
}

export default getbody;
