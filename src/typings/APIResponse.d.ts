import type Format from './Format';

export interface APIFailResponse {
  ok: false;
  msg: string;
}

export interface APISuccessResponse  {
  ok: true;
  title: string;
  url: string;
  id: string;
  thumbnail: string;
  duration: string;
  platform: string;
  author: {
    name: string;
    url: string;
  };
  formats: Format[];
}
