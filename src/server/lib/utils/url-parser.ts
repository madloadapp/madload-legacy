import urllib from 'url';

export function isValidURL(url: string): boolean {
  return /^(https?:\/\/){0,1}(www\.){0,1}[\d-.a-z]+\.[a-z]{2,5}\.{0,1}/i.test(
    url
  );
}

export function getDomain(url: string, sub?: boolean): string {
  const { hostname } = urllib.parse(url);

  if (!hostname) {
    return '';
  }

  return sub
    ? hostname
    : hostname.replace(/(https?:\/\/){0,1}(www\.){0,1}/i, '');
}

export function getParam(url: string, param: string): string | null {
  return new urllib.URL(url).searchParams.get(param);
}
