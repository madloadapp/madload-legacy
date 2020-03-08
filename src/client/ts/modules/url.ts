export const supportedSites: string[] = [
  'youtube.com',
  'youtu.be',
  'soundcloud.com',
  'twitter.com',
  'facebook.com',
  'instagram.com'
];

export const regexp: RegExp = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/i;

export function isValid(url: string): boolean {
  const urlMatch: RegExpMatchArray | null = url.match(regexp);

  if (
    urlMatch &&
    urlMatch.length > 0 &&
    supportedSites.includes(
      urlMatch[0].replace(/(http[s]?:\/\/)|(www\.)/gi, '')
    )
  ) {
    return true;
  }

  return false;
}
