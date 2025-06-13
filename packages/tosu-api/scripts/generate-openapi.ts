import { readFile, writeFile } from 'node:fs/promises'

import openApiTs, { astToString } from 'openapi-typescript'

async function main() {
  const openApiAst = await openApiTs(
    JSON.parse(await readFile('openapi.json', 'utf-8')),
    { dedupeEnums: true },
  )
  const openApiFile = astToString(openApiAst)
    // omit schemas
    .replace(
      /export interface components \{\n {4}schemas: \{[\s\S]+\n {4}\};/,
      'export interface components {\n    schemas: never;',
    )
    // replace schemas with defined types
    .replace(/components\["schemas"\]\["(.+?)"\];/g, 't.$1')
  await writeFile(
    'src/openapi.ts',
    `/** @generated */\n\nimport type * as t from 'tosu-api-types'\n\n${openApiFile}`,
    'utf-8',
  )
}

main()
