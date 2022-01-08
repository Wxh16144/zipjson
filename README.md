# zipjson

Use JSON Stringify compressed JSON file

## Usage

```bash
npx zipjson package.json
```

## Options

```bash
npx zipjson@latest {input} {output} --debug
```

+ **input**: file or path. default `./index.json`
+ **output**: file or path. default `./dist/index.json`
+ **--debug**: console log. defaule `false`, alias `--log`,`-l`,`-d`
+ **--yes**: Agree to all interactions. defaule `false`, alias `--ci`,`-y`

## Development

**Prerequisites**

+ Node.js 14.17.0

### Set up repository

Create your own copy of [wxh16144/zipjson](https://github.com/wxh16144/zipjson) by forking the repository.

![GitHub forks](https://img.shields.io/github/forks/wxh16144/zipjson?style=for-the-badge)

Once you have created your own fork, clone the repo to your local machine.

Make sure to replace YOUR_GITHUB_USERNAME with your actual username.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/zipjson.git
```

Finally, link your fork back to the upstream repo so you can pull the latest updates and contribute changes back.

```bash
cd zipjson
git remote add upstream https://github.com/wxh16144/zipjson.git
```

### Debugger

**VSCode**

[Debugging](https://code.visualstudio.com/docs/editor/debugging) con strumenti di debug VSCode, with `F5`

**Script**

```bash
npm run build
# or
node index.mjs package.json --debug
```
