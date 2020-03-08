import urllib from 'url';
import qs, { ParsedUrlQuery } from 'querystring';
import axios, { AxiosResponse } from 'axios';
import jsdom from 'jsdom';
import { AllHtmlEntities as Entities } from 'html-entities';

const entities = new Entities();

export function downloadWebPage(url: string): Promise<string | Error> {
  return new Promise(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await axios.get(url);
      resolve(entities.decode(response.data));
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
