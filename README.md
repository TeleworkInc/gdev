# 𝓰𝓷𝓿
Javascript development workspaces built around
[Rollup](https://github.com/rollup/rollup) and [Closure
Compiler](https://github.com/google/closure-compiler) with full CJS/ESM interop.

### Easily build CLI, browser, and Node packages all in one workspace using the latest syntax.
Build the **smallest** and **fastest** bundles for **multiple targets** with
**no dependencies**¹.  With dependency-free outputs, all of your package's
dependencies will be baked into the compiled output for each target, so
`package.json` will contain no `dependencies` or `devDependencies` fields and
`npm install` will only need to download what is in the `dist/` directory.  

## Usage
Creating a new gnv workspace with `gnv create [name]` will initialize a folder
with a `lib/` and an `exports/` directory. gnv projects are like modules in that
they have **exports** for different **targets**, which will create corresponding
outputs in `dev/` and `dist/` build directories.

Think of `lib/` as a sandbox - it is where all internal code will go, and the
`exports/` folder is where exports are defined for each target. Exports will
typically `import` different things from `lib/` and then expose some information
to a given target. To expose exports for a given **target**, `export` values
from `exports/[target].js`.

```
lib
├── commands.js
├── templates.js
├── TestAB.js
├── TestC.js
└── TestDefault.js
exports
├── **cli.js**
├── node.js
├── testExport.js
└── universal.js
```

There are three reserved **targets**, which will build with special assumptions.
For instance, `cli.js` and its compiled output will both be set to be
executable. Other targets at `exports/[target].js` will build with the same
default settings.

| Target Filename | Description |
|--|--|
| `exports/cli.js` | A CLI that is hooked into the `bin` field of `package.json` and will execute when your package is called from the command line. |
| `exports/node.js` | A module which will be exposed to Node, i.e. what what users will `import` or `require` from inside a NodeJS script. |
| `exports/universal.js` | A module which does not rely on *any* Node dependencies and can be run in any environment (browser, Node, etc.). Primarily for browser bundles and pure vanilla JS programs which will benefit from the maximum level of compression offered by the Closure Compiler. The **executable** (see below) will be generated from the **universal** target output

Building the project with `gnv compile` will create development and distribution
folders that look like:
```
dev
├── **cli.cjs**
├── **cli.mjs**
├── node.cjs
├── node.mjs
├── testExport.cjs
├── testExport.mjs
├── universal.cjs
└── universal.mjs
dist
├── **cli.cjs**
├── **cli.mjs**
├── exe.js
├── node.cjs
├── node.mjs
├── testExport.cjs
├── testExport.mjs
├── universal.cjs
└── universal.mjs
```

Where **\*\*bold\*\*** indicates an executable file.

## What's `exe.js` and how does the universal export work?
The **executable** output is generated from the **universal** target. While
**universal** specifies exports that can be `import`'d and `require`'d, `exe.js`
is the most compressed version of this module which exports nothing and aims to
only produce the same *side effects* as the `exports/universal.js`. What this
means is that the codebase is boiled down to only *what would actually execute*
in the JS runtime when `universal.js` is run.

For example:

`exports/universal.js ->`
```javascript
/**
 * Expose data from `lib/`.
 */

export * from '../lib/TestAB.js';
export * from '../lib/TestC.js';

export { default as TestDefault } from '../lib/TestDefault.js';
export { TEST_STRING } from '../lib/templates.js';

/**
 * This is a side effect that won't get removed due to dead code elimination.
 */
const a = 10;
console.log(`a is ${a}`);
```

`-> dist/universal.cjs`

All exports from **universal** are exposed.

```javascript
'use strict';var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(b){return b.raw=b};$jscomp.createTemplateTagFirstArgWithRaw=function(b,c){b.raw=c;return b};Object.defineProperty(exports,"__esModule",{value:!0});var TestA=function(){console.log("Test A!")},TestB=function(){console.log("Test B!")},TestC=function(){console.log("Test C!")},TestDefault=function(){console.log("Default checking in!")},TEST_STRING="HELLO WORLD!",a=10;console.log("a is "+a);
exports.TEST_STRING=TEST_STRING;exports.TestA=TestA;exports.TestB=TestB;exports.TestC=TestC;exports.TestDefault=TestDefault;
```

`-> dist/exe.js`

All dead code is removed, only executed side effects are included. Full Closure
Compiler optimization.

```javascript
console.log("a is 10");
```

## How will my package work with `require` and `import`?
The goal of gnv workspaces is full CJS/ESM interop, and `require` and `import`
should both expose your `exports/node.js` exports as expected thanks to Rollup. 

`ES6 | namedImportTest.mjs [PASSING]`
```javascript
import { TestA, TestB, TestC, TestDefault } from '../dist/universal.mjs';
```

`CJS | namedImportTest.cjs [PASSING]`
```javascript
const { TestA, TestB, TestC, TestDefault } = require('../dist/universal.cjs');
```

## How does the `node.js` export work?
Node will `import` or `require` the appropriate compiled export file
(`dist/node.mjs` or `dist/node.cjs` respectively) in `dist/`. The following
settings allow for this:

* `.mjs` and `.cjs` extensions on built files for explicit specification of
  ES/CJS modules
* `"main": "dist/node.cjs"` in `package.json` for pre-13.2.0 compatibility
* `"exports": { ... }` in `package.json` to specify CJS and ESM export locations
  for post-13.2.0 `import`/`require` support
* `"type": "module` in `package.json` so ES6 `import`/`export` are available by
  default, i.e. for inside `lib/`.

## How does the `cli.js` export work?
The `bin` field of `package.json` points to `dist/cli.cjs` and
uses the `commander` package by default to provide an interactive command line
interface. 

gnv will generate `cli.js` with an example program when a new
workspace is created with `gnv create my-project-name`. Call your CLI at the
command line with `my-project-name` and you will see `Welcome to gnv!` printed
to stdout.

## How do I use third party modules if I want to keep my `package.json` free of dependencies? 
We're used to doing `yarn add [pkg]` / `npm install [pkg]` when we need to use a
new third party module in our project. The solution is to the packages globally
with `npm i -g [pkg]` or `yarn global add [pkg]`, and then use them as you
normally would in your code. This will also prevent you from downloading the
same packages over and over again into a thousand different folders, and you
will be free to import them without thinking. 

It may seem like a waste of disk space to hold onto a cumulative copy of the NPM
database, but you'll end up downloading those packages either way - the only
thing that will vary is whether or not you store it a thousand different times.
Ultimately, this is a more efficient approach.

You can always add dependencies locally rather than globally and ship the
package as-is, if your priorities are different.

## Aren't global NPM installs bad?
No. The most popular article explaining why it might be a bad idea to install
packages globally offered the following reasoning:

> The obvious short answer is that your project depends on them. If your project
> depends on a package, it should be documented in package.json so that you can
> guarantee that it is installed when someone types npm install. Otherwise,
> you’ll need to add extra steps in your README file to inform anyone else who
> clones your project that they need to install each of your global dependencies
> as well.

However, since our dependencies are rolled into the compiled output, this is no
longer a concern, and we can save the user a step and ship them only the code
that they will actually be executing.

# Footnotes
¹ Dependency-free outputs will be available once [full Rollup-Node
coverage](https://github.com/TeleworkInc/rollup-node-testing) is complete.
Presently, CommonJS output (`dist/*.cjs`) will have all dependencies rolled in,
but because ES6 modules do not (completely) support Node module resolution,
`package.json` will still contain `dependencies` and `devDependencies` fields
until Rollup issues are resolved.