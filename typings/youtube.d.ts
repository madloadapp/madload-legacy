export type GetVideoDataResponse = {
  status: string;
  player_response: string; // before it actually parsed...
  hl: string;
  [key: string]: string | string[];
};

export interface PlayerResponse {
  playabilityStatus: {
    status: string;
    playableInEmbed: boolean;
    contextParams: string;
  };
  streamingData: StreamingData;
  videoDetails: VideoDetails;
}

export interface ParsedPlayerResponse {
  status: string;
  expiresInSeconds: string;
  formats: VideoFormat[];
  details: VideoDetails;
}

export interface StreamingData {
  expiresInSeconds: string;
  formats: VideoFormat[];
  adaptiveFormats: VideoFormat[];
}

export interface VideoFormat {
  itag: number;
  url?: string;
  mimeType: string;
  bitrate: number;
  width: number;
  height: number;
  lastModified: string;
  contentLength: string;
  quality: string;
  qualityLabel: string;
  projectionType: string;
  averageBitrate: number;
  audioQuality: string;
  approxDurationMs: string;
  audioSampleRate?: string;
  audioChannels?: number;
  cipher?: string | VideoCipher;
  initRange?: {
    start: string;
    end: string;
  };
  indexRange?: {
    start: string;
    end: string;
  };
  colorInfo?: {
    primaries: string;
    transferCharacteristics: string;
    matrixCoefficients: string;
  };
}

export interface VideoDetails {
  videoId: string;
  title: string;
  author: string;
  channelId: string;
  isOwnerViewing: boolean;
  lengthSeconds: string;
  viewCount: string;
  isPrivate: boolean;
  shortDescription: string;
  keywords: string[];
  thumbnail: {
    thumbnails: VideoThumbnail[];
  };
  averageRating: number;
  allowRatings: boolean;
  isUnpluggedCorpus: boolean;
  isLiveContent: boolean;
}

export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoCipher {
  x: string;

}

// madload api stuff

export interface APIResponse {
  id: string;
  title: string;
  date: string;
  author: {
    name: string;
    link: string;
  };
  formats: APIResponseVideoFormat[];
}

export interface APIResponseVideoFormat {
  itag: number;
  url: string;
  mimeType: string;
  width: number;
  height: number;
  quality: string;
  qualityLabel: string;
}
