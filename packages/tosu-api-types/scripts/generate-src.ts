import type { SpawnOptions } from 'node:child_process'
import { spawn } from 'node:child_process'
import { cp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

function runSubProcess(command: string, args: string[], options: SpawnOptions) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: 'inherit' })
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

async function replaceFile(file: string, replace: [string | RegExp, string][]) {
  let content = await readFile(file, 'utf-8')
  for (const [key, value] of replace) {
    content =
      key instanceof RegExp
        ? content.replace(key, value)
        : content.replaceAll(key, value)
  }
  await writeFile(file, content, 'utf-8')
}

async function listFiles(dir: string, pfx: string, suffix: string): Promise<string[]> {
  const files = await readdir(dir, { withFileTypes: true })
  const tasks = files.map((v) =>
    v.isDirectory()
      ? listFiles(path.join(dir, v.name), `${pfx}${v.name}/`, suffix)
      : `${pfx}${suffix ? path.basename(v.name, suffix) : v.name}`,
  )
  return (await Promise.all(tasks)).flat()
}

async function main() {
  await runSubProcess('git', ['switch', 'master'], { cwd: 'tosu' })
  await runSubProcess('git', ['pull'], { cwd: 'tosu' })

  await rm('src', { recursive: true, force: true })

  await cp('tosu/packages/common/enums', 'src/common', { recursive: true })

  await cp('tosu/packages/tosu/src/utils/osuMods.types.ts', 'src/tosu/osuMods.types.ts')
  await replaceFile('src/tosu/osuMods.types.ts', [
    ["from '@tosu/common'", "from '../common/osu'"],
  ])

  await cp(
    'tosu/packages/tosu/src/utils/settings.types.ts',
    'src/tosu/settings.types.ts',
  )
  await replaceFile('src/tosu/settings.types.ts', [
    [/export interface ScoreMeter \{[\s\S]+?\}/g, '/* $& */'],
    [/(interface |: )Volume/g, '$1SettingsVolume'],
  ])

  await cp('tosu/packages/tosu/src/api/types', 'src/tosu', { recursive: true })
  await replaceFile('src/tosu/v1.ts', [['type ApiAnswer', 'type ApiAnswerV1']])
  await replaceFile('src/tosu/v2.ts', [
    ['type ApiAnswer', 'type ApiAnswerV2'],
    ["from '@/utils/", "from './"],
  ])

  await cp(
    'tosu/packages/server/utils/counters.types.ts',
    'src/server/counters.types.ts',
  )

  const exports = (await listFiles('src', './', '.ts')).map(
    (x) => `export * from '${x}'`,
  )
  await writeFile('src/index.ts', exports.join('\n'), 'utf-8')
}

main()
