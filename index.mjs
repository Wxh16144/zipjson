#!/usr/bin/env node

import { resolve } from 'path'
import { createInterface } from 'readline'
import zipJson, { isJsonString } from './stringify.mjs'
import { readFileSync, writeFileSync, existsSync, mkdirSync, lstatSync } from 'fs'

const ROOT = process.cwd()
const DEFAULT_ENTRY = 'index.json'
const LOG = process.argv.slice(2).includes('--debug')
  || process.argv.slice(2).includes('--log')
  || process.argv.slice(2).includes('-d')
  || process.argv.slice(2).includes('-l')

const YES = process.argv.slice(2).includes('--yes')
  || process.argv.slice(2).includes('--ci')
  || process.argv.slice(2).includes('-y')

const argv = process.argv.slice(2).reduce((args, arg) => {
  // https://github.com/Wxh16144/zipjson/issues/1
  if (arg.match(/^-{1,2}/)) return args
  return args.concat(arg)
}, [])

let entry = resolve(ROOT, argv[0] || DEFAULT_ENTRY)


LOG && console.log(`userInputEntry: ${argv[0]}`);
LOG && console.log(`userInputOutput: ${argv[1]}`);
LOG && console.log(`system entry: ${entry}`);


if (isFilePath(entry)) {
  LOG && console.log(`entry: ${entry} Seems to be a file path`);
  if (isDirectory(entry)) {
    LOG && console.log(`entry: ${entry} Well, it's a directory`);
    entry = resolve(entry, DEFAULT_ENTRY)
    LOG && console.log(`system entry: ${entry}`);
  }
}
else if (isDirectory(entry)) {
  LOG && console.log(`entry: ${entry} it's a directory`);
  entry = resolve(entry, DEFAULT_ENTRY)
  LOG && console.log(`system entry: ${entry}`);
}

let output = resolve(ROOT, argv[1] || resolveOutput(entry))

LOG && console.log(`system output: ${output}`);


if (isFilePath(output)) {
  LOG && console.log(`output: ${output} It looks like a file, but I won't deal with it`);
}
else {
  LOG && console.log(`output: ${output} Treat as file directory`);
  if (output === ROOT) {
    LOG && console.log(`output: ${output} Is a root directory`);
    output = resolve(ROOT, resolveOutput(entry))
    LOG && console.log(`system output: ${output}`);
  }
  else {
    output = resolve(output, resolveOutput(entry, '.'))
    LOG && console.log(`system output: ${output}`);
  }
}

LOG && console.log(`Ready to execute path:`, { entry, output });

const outputPath = output.split('/').slice(0, -1).join('/')

if (!existsSync(outputPath)) {
  mkdirSync(outputPath, { recursive: true })
}

if (entry === output && !YES) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  })
  readline.question(`[WARN] entry and output is same! Are you sure?`, async name => {
    if (!!name) {
      try {
        await core(entry, output)
        console.log(`[SUCCESS]`, `${entry} ==> ${output}`);
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    } else {
      console.log(`[INFO] You cancel the operation`);
    }

    readline.close()
    process.exit(0)
  })
} else {
  try {
    await core(entry, output)
    console.log(`[SUCCESS]`, `${entry} ==> ${output}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

// ------------ core ------------
async function core(entry, output) {
  const rawdb = await readFileSync(entry, 'utf8')
  if (!isJsonString(rawdb)) {
    await Promise.reject(`[ERROR] ${entry} is not a valid json file`)
  }
  await writeFileSync(output, zipJson(rawdb), 'utf8')
}

// ------------ utils ------------
function validFileExt(path) {
  const ext = ['json', 'js', 'ts', 'jsx', 'tsx', 'mjs', 'mts', 'mjsx', 'mtsx']
  return ext.some(ext => path.endsWith(`.${ext}`))
}

function isFilePath(path) {
  const fileName = path.split('/').pop()
  return fileName && fileName.includes('.') && !!fileName.split('.').pop()
}

function isDirectory(path) {
  return lstatSync(path, {}).isDirectory()
}

function resolveOutput(path, base = "dist") {
  return `${base}/${path.split('/').slice(-1).pop()}`
}
