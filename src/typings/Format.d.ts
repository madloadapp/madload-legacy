export default interface Format {
  url: string;
  ext: string;
  format: string;
  filesize: number;
  formatNote?: string;
  vcodec?: string;
  acodec?: string;
}
