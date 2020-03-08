import error from './error';
import APIResponse from '../../../typings/APIResponse';

export default async (url: string): Promise<APIResponse> => {
  const controller: AbortController = new AbortController();

  try {
    const body: Body = await fetch('/api', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({ url })
    });

    return body.json();
  } catch (err) {
    error('Request failed');
    console.error(err);
    return err;
  }
};
