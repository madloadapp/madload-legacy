function getDate(): string {
  const date: Date = new Date();

  return `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export function success(msg: string): string {
  const text: string = `[success]: ${msg ||
    'unknown success message'} (${getDate()})`;

  console.log(text);
  return text;
}

export function error(msg: string | Error): string {
  if (msg instanceof Error) msg = msg.message;

  const text: string = `[error]: ${msg || 'unknown error'} (${getDate()})`;

  console.log(text);
  return text;
}

export function log(msg: string): string {
  const text: string = `[log]: ${msg || 'no msg'}`;

  console.log(text);
  return text;
}
