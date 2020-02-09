const validUrl = url => {
  if (!url) return false;

  const supportedSites = [
    'youtube.com',
    'youtu.be',
    'soundcloud.com',
    'twitter.com',
    'facebook.com',
    'instagram.com'
  ];

  const urlMatch = url.match(
    /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/i
  );

  if (
    urlMatch &&
    urlMatch.length > 0 &&
    supportedSites.includes(
      urlMatch[0].replace(/(http[s]?:\/\/)|(www\.)/gi, '')
    )
  )
    return true;

  return false;
};

module.exports = validUrl;
