import type { ClientOptions, Middleware } from 'openapi-fetch'
import createClientOriginal from 'openapi-fetch'

import type { paths } from './openapi'

export type MediaType = `${string}/${string}`

export class APIError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly response: Response,
  ) {
    super(`[${status}] ${message}`)
    this.name = 'APIError'
  }
}

export const defaultMiddleware: Middleware = {
  async onResponse({ response }) {
    let content: string
    try {
      content = await response.clone().text()
    } catch {
      if (response.ok) return
      throw new APIError(response.status, '', response)
    }

    let json: any
    try {
      json = JSON.parse(content)
    } catch {
      if (response.ok) return
      throw new APIError(response.status, content, response)
    }

    if ('error' in json && Object.keys(json).length === 1) {
      throw new APIError(response.status, json.error, response)
    }
  },
}

export function createClient<M extends MediaType = MediaType>(options: ClientOptions) {
  return createClientOriginal<paths, M>(options).use(defaultMiddleware)
}
