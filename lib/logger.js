module.exports = (type, msg) => {
  const date = new Date();

  if (type && !msg) {
    msg = type;
    type = 'log';
  }

  if (typeof msg === 'object') msg = msg.message;
  const text = `[${type}]: ${(msg && (msg.endsWith('.') ? msg : msg + '.')) ||
    'unknown error.'} (${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()})`;

  console.log(text);
  return text;
};
