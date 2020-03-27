import urllib from 'url';
import * as parser from '../utils/parser';
import getbody from '../utils/getbody';
import { IGSharedData } from '../../typings/Instagram';

class Instagram {
  public url: string;
  public postId: string;
  private sharedDataRegExp: RegExp = /window\._sharedData\s*=\s*({.+?});/i;

  constructor(url: string) {
    this.url = url;
    this.postId = this.extractPostId();
  }

  private extractPostId(): string {
    const url = this.url;

    let postId: string;

    if (parser.isValidURL(url)) {
      const domainName = parser.getDomain(url);

      if (domainName === 'instagram.com') {
        postId = urllib.parse(url).pathname?.substr(4);
      } else {
        throw Error('url must be relative to instagram');
      }
    } else {
      throw Error('invalid url');
    }

    return postId;
  }

  private async getMediaData(url: string): Promise<object> {
    const webPage: string = await getbody(url);
    const matchData: RegExpMatchArray | null = webPage.match(sharedDataRegExp);

    if (matchData && matchData[1]) {
      const sharedData: IGSharedData = JSON.parse(matchData[1]);
    } else {
      throw Error('unable to parse media data');
    }
  }
}

export default Instagram;
