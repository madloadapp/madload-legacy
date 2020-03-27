import * as urllib from 'url';
import * as qs from 'querystring';
import getbody, { GetBodyResponse } from './getbody';

import type { ObjectOfAnys } from '../../typings/global';

export function downloadWebPage(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const response: GetBodyResponse = await getbody(url);
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}

export function stripHTML(str: string): string {
  return str.replace(/<[^>]+>/g, '');
}

export function getIndex(haystack: string, needle: string | RegExp): number {
  return needle instanceof RegExp
    ? haystack.search(needle)
    : haystack.indexOf(needle);
}

export function between(
  str: string,
  left: string | RegExp,
  right: string | RegExp
): string {
  return str.slice(getIndex(str, left), getIndex(str, right));
}

export const supportedWebsites: string[] = [
  'youtube.com',
  'youtu.be',
  'soundcloud.com',
  'twitter.com',
  'facebook.com',
  'instagram.com'
];


export function getDomain(url: string, sub: boolean = false): string {
  const { hostname } = urllib.parse(url);

  if (!hostname) {
    return '';
  }

  return (sub
    ? hostname
    : hostname.replace(/(https?:\/\/){0,1}(www\.){0,1}/i, '')
  ).toLowerCase();
}

export function getParam(url: string, param: string): string | null {
  return new urllib.URLSearchParams(url).get(param);
}

export function isValidURL(url: string, checkSupported: boolean = true): boolean {
  return /^(https?:\/\/){0,1}(www\.){0,1}[\d-.a-z]+\.[a-z]{2,5}\.{0,1}/i.test(
    url
  ) && checkSupported && supportedWebsites.includes(getDomain(url));
}

export function querystring(str: string): any {
  return qs.parse(str);
}
