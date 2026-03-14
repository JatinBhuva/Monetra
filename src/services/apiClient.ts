import { ApiMethods } from '../utils/constants';

type RequestConfig = {
  method?: keyof typeof ApiMethods;
  body?: object;
  headers?: Record<string, string>;
};

export async function apiRequest<TResponse>(
  url: string,
  config: RequestConfig = {},
): Promise<TResponse> {
  const { method = ApiMethods.GET, body, headers } = config;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as TResponse;
}
