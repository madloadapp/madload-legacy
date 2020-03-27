import qs from 'querystring';
import urllib from 'url';
import * as parser from '../utils/parser';
import getbody, { GetBodyResponse } from '../utils/getbody';
import * as YTT from '../../typings/youtube';

class YouTube {
  public url: string;
  public videoId: string;
  private getVideoInfoURL: string;

  constructor(url: string) {
    this.url = url;

    let videoId: string = this.extractVideoId();

    this.videoId = videoId;
    this.getVideoInfoURL = urllib.format({
      protocol: 'https',
      host: 'www.youtube.com',
      pathname: 'get_video_info',
      query: {
        video_id: videoId,
        eurl: `https://youtube.googleapis.com/v/${videoId}`,
        ps: 'default',
        hl: 'en',
        gl: 'us'
      }
    });
  }

  private extractVideoId(): string {
    let videoId: string;

    if (parser.isValidURL(this.url)) {
      const domainName: string = parser.getDomain(this.url);

      if (domainName === 'youtube.com') {
        videoId = parser.getParam(this.url, 'v') || '';
      } else if (domainName === 'youtu.be') {
        videoId = urllib.parse(this.url).pathname?.substr(1) || '';
      } else {
        throw Error('url must be relative to youtube');
      }
    } else {
      throw Error('invalid url');
    }

    if (!videoId) {
      throw Error('invalid video id');
    }

    return videoId;
  }

  private async parsePlayerResponse(): Promise<YTT.ParsedPlayerResponse> {
    const res: GetBodyResponse = await getbody(this.getVideoInfoURL);
    const videoDataRes: YTT.GetVideoDataResponse = parser.querystring(res.data);

    if (videoDataRes.status === 'ok') {
      const playerResponse: YTT.PlayerResponse = JSON.parse(
        <string>videoDataRes.player_response
      );

      const formats: YTT.VideoFormat[] = this.sortFormats(
        playerResponse.streamingData.formats
      );

      // decipher stuff
      if (formats[0].cipher) {
        formats.forEach(format => {
          if (typeof format.cipher === 'string') {
            format.cipher = JSON.parse(format.cipher);
          }
        });
      }

      return {
        status: videoDataRes.status,
        expiresInSeconds: playerResponse.streamingData.expiresInSeconds,
        details: playerResponse.videoDetails,
        formats
      };
    } else {
      throw Error('cannot parse video info');
    }
  }

  private decipher(chiper: YTT.VideoCipher) {} // ya gotta compelete this...

  private sortFormats(formats: YTT.VideoFormat[]): YTT.VideoFormat[] {
    return formats.sort(
      (a, b) => parseInt(b.qualityLabel) - parseInt(a.qualityLabel)
    );
  }

  public async getInfo(): Promise<YTT.APIResponse> {
    const playerResponse: YTT.ParsedPlayerResponse = await this.parsePlayerResponse();
    const videoDetails: YTT.VideoDetails = playerResponse.details;
    const formats: YTT.VideoFormat[] = this.sortFormats(playerResponse.formats);

    // return {
    //   id: this.videoId,
    //   title: videoDetails.title,
    //   author: {
    //     name: videoDetails.author,
    //     link: `https://www.youtube.com/channel/${videoDetails.channelId}`
    //   },
    //   formats
    // };
    return playerResponse;
  }
}

export default YouTube;
