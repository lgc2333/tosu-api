import { readFileSync, writeFileSync } from 'node:fs'

import yaml from 'js-yaml'
import * as tsSchemaGen from 'ts-json-schema-generator'

const schemas = tsSchemaGen
  .createGenerator({ path: '../tosu-api-types/src/**/*.ts' })
  .createSchema()
writeFileSync('schemas.json', JSON.stringify(schemas, null, 2), 'utf-8')

const openApi: any = yaml.load(readFileSync('openapi-base.yaml', 'utf-8'))
;(openApi.components ??= {}).schemas = schemas.definitions
const openApiJson = JSON.stringify(
  openApi,
  (k, v) => (k === '$ref' ? v.replace('#/definitions/', '#/components/schemas/') : v),
  2,
)
writeFileSync('openapi.json', openApiJson, 'utf-8')
