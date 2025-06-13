import type {
  GosuCompatibleApi,
  TosuAPi,
  TosuPreciseAnswer,
  scAPI,
} from 'tosu-api-types'

import type { WSOptions, WsPath } from './utils'
import { WebSocketClient } from './utils'

// eslint-disable-next-line ts/consistent-type-definitions
export type ws = {
  '/ws': {
    path: never
    params: never
    send: never
    recv: GosuCompatibleApi
  }
  '/tokens': {
    path: never
    params: never
    send: never
    recv: scAPI
  }
  '/websocket/v2': {
    path: never
    params: never
    send: never
    recv: TosuAPi
  }
  '/websocket/v2/precise': {
    path: never
    params: never
    send: never
    recv: TosuPreciseAnswer
  }
}

export function createWs<P extends WsPath<ws>>(
  baseUrl: string,
  path: P,
  options: WSOptions<ws, P>,
): WebSocketClient<ws, P> {
  return new WebSocketClient<ws, P>(baseUrl, path, options)
}
