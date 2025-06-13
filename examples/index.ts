/* eslint-disable no-console */
import { Buffer } from 'node:buffer'
import { writeFile } from 'node:fs/promises'

import { createClient, createWs } from 'tosu-api'

async function main() {
  const http = createClient({ baseUrl: 'http://127.0.0.1:24050' })

  const jsonV2Data = (await http.GET('/json/v2')).data!
  console.log('Current beatmap: ', jsonV2Data.beatmap)

  const currBgBlob = (
    await http.GET('/files/beatmap/background', {
      parseAs: 'arrayBuffer',
    })
  ).data!
  await writeFile('background.png', Buffer.from(currBgBlob))
  console.log('Current background image saved as background.png')

  const ws = createWs('ws://127.0.0.1:24050', '/websocket/v2', {})
  ws.addEventListener('open', () => {
    console.log('WebSocket connection opened')
  })
  ws.addEventListener('error', (event) => {
    console.error('WebSocket error:', event)
  })
  ws.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event)
  })
  ws.addEventListener('parseError', (event) => {
    console.error('WebSocket parse error:', event.detail.error)
  })
  ws.addEventListener('message', async (event) => {
    console.log('Received current beatmap from WebSocket:', event.detail.data.beatmap)
    ws.stop()
  })
  ws.start()
}

main()
