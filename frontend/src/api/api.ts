import config from '../config/config';

const apiBaseUrl = config.apiBaseUrl;

export async function fetch(uri: string, options?: RequestInit) {
  const response = await window.fetch(`${apiBaseUrl}/${uri}`, options);
  const data = await response.json();
  return data;
}