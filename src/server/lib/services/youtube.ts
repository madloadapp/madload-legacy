import qs, { ParsedUrlQuery } from 'querystring';
import axios, { AxiosResponse } from 'axios';
import * as parser from '../utils/parser';

class YouTube {
  private getVideoInfoURL: string;
  private videoInfo: string;

  constructor(videoId: string) {
    this.getVideoInfoURL = `https://www.youtube.com/get_video_info?video_id=${videoId}`;
    try {
      this.fetchInfo();
    } catch (err) {}
    return this;
  }

  private async fetchInfo(): Promise<object | Error> {
    try {
      const res: AxiosResponse = await axios.get(this.getVideoInfoURL);
      const info: ParsedUrlQuery = qs.parse(res.data);

      return info;
    } catch (err) {
      throw err;
    }
  }

  public async getInfo(): Promise<object> {
    return await this.fetchInfo();
  }
}

export default YouTube;
