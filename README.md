![gnv logo](https://repository-images.githubusercontent.com/277466515/e14f0580-f83c-11ea-9022-8f1c93721124)

[![Build
Status](https://travis-ci.org/TeleworkInc/gnv.svg?branch=master)](https://travis-ci.org/TeleworkInc/gnv)

### Easily build standalone CLI, browser, and Node packages all in one workspace using the latest syntax.
Build the **smallest and fastest** JS packages for **multiple targets** with
**no runtime dependencies** and **full backwards compatibility**.

All of your
package's dependencies will be baked into the compiled output for each target,
so `package.json` will contain no `dependencies` or `devDependencies` fields and
`npm install` will only need to download what is in the `dist/` directory. 

## Prerequisites 
This package has no mandatory dependencies aside from Rollup and Closure
Compiler (and related plugins). `gnv create` sets up GitHub repositories by
default using `hub`, but this can be disabled with `--no-github` flag.

### Note: This package relies on POSIX commands.
Linux & MacOS should work out of the box. Use [Windows Subsystem for
Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) if a real
operating system is not available.

### System
It is recommended to install these.

| Package     | Description |
| ----------- | ----------- |
| `hub`   | A CLI for managing GitHub repositories developed by GitHub. **[Install](https://github.com/github/hub#installation)**<br>*(Optional: Use `--no-github` flag to disable.)* |

### npm (global)
To use gnv, first install it with:
```shell
npm i -g gnv
```

The gnv CLI will then be functional, but you will not actually be able to bundle
anything without Closure Compiler and Rollup, as mentioned above. A convenience
command is built into the CLI to save time, and you can install the necessary
peer dependencies for gnv (or any gnv package) with: 

```shell
gnv get-peer-deps
```

![gnv get-peer-deps](https://i.imgur.com/6giWmjx.gif) 

This will call `npm i -g` to install the needed global deps and then link them
in the workspace with `npm link`. You could manually install and link the peer
deps yourself, but this is much easier.

### I thought gnv packages don't require dependencies?
Most compiled gnv projects will not have peer dependencies, but gnv itself
relies on native Closure Compiler binaries, and it is all around more performant
to just include these tools as peerDeps in this case. Rollup will be bundled
into gnv, rather than added as a peerDep, soon (stability is the goal right
now).

## Usage
You can create, build, and develop gnv workspaces with the `gnv` CLI.

### Commands
Excludes `get-peer-deps`. 

| Package     | Description |
| ----------- | ----------- |
  `add [options] <pkgs...>` | Add the given packages as gnv development dependencies. |
  `build [options]` | Build this workspace and run tests when finished. Final output will be in `dist/`. |
  `clean` | Clean the gnv workspace. |
  `create [options] <name>` | Create a new gnv workspace and push to GitHub. Use `<organization/name>` to create for an organization. Requires `hub` package or -ng flag. |
  `develop` | Start developing, and rebuild dev bundles when changes are made to the workspace. |
  `install [options] [directory]` | Install all dependencies in `[directory]/package.json`. Defaults to working directory. |
  `publish [level]` | Publish this package to NPM using `npm publish`. Removes dev CLI from package.json to prevent installation issues and bumps the version by  [level] (patch, minor, or major). Defaults to patch. |
  `remove [options] <pkgs...>` | Remove the given packages from gnv development dependencies. |
  `test` | Run mocha tests. |

### Workspace structure
A gnv project contains: 
- a `.gnv` folder that contains configuration information and Rollup scripts
- a `lib/` directory for storing library code
- an `exports/` folder for exposing data to export targets

The structure of the actual codebase generally looks like:
<pre>
lib
├── commands.js
└── templates.js
exports
├── <b>cli.js</b>
├── node.js
└── universal.js
</pre>

Where bolded **`file`** indicates an executable file. If you need a concrete
example, this project itself is a gnv workspace, and its skeleton is printed
when the `gnv` command is called inside a gnv workspace, as seen in the `gnv
get-peer-deps` example above.

Think of `lib/` as a sandbox - it is where all internal logic will go, and the
`exports/` folder is where endpoints are *exposed* for each target. Exports will
typically `import` different things from `lib/` and then expose different
information for different targets at `exports/[target].js`.

For instance, gnv's `create()` function in `lib/commands.js` is exposed to the
CLI at `exports/cli.js` for initializing new projects at the command line. It is
also exported for usage in Node programs at `exports/node.js`, and can then be
required and imported in the form `import { create } from 'gnv'` in third party
Node packages.

### Creating a new workspace
Creating a new gnv workspace with `gnv create [organization]/name` will
initialize a GitHub repository with a `lib/` and an `exports/` directory and
install it to the current directory (as a submodule, if inside a git repo). gnv
projects are like modules in that they have **exports** for different
**targets**, which will create corresponding outputs in `dev/` and `dist/`
directories during the build process.

### Building a workspace
Building the workspace with `gnv build` will create development and distribution
folders. The modules in `dev` are simply Rollup outputs, and they build very
quickly as they do not resolve Node modules. The outputs in `dist` are the final
compiled outputs of a project, and will resolve all third party dependencies and
Closure Compile the outputs.

Here is what the generated `dev` and `dist` directories look like:

<pre>
dev
├── <b>cli.cjs</b>
├── <b>cli.mjs</b>
├── node.cjs
├── node.mjs
├── universal.cjs
└── universal.mjs
dist
├── <b>cli.cjs</b>
├── <b>cli.mjs</b>
├── exe.js
├── node.cjs
├── node.mjs
├── universal.cjs
└── universal.mjs
</pre>

## Reserved build targets
There are three **reserved targets**, which will build with special assumptions.
For instance, `cli.js` and its compiled output will both be set to be
executable. Non-reserved targets at `exports/[target].js` will all build with
the same default settings.

| Target Filename | Description |
|--|--|
| `exports/cli.js` | A CLI that is hooked into the `bin` field of `package.json` and will execute when your package is called from the command line. |
| `exports/node.js` | A module which will be exposed to Node, i.e. what what users will `import` or `require` from inside a NodeJS script. |
| `exports/universal.js` | A module which does not rely on *any* Node dependencies and can be run in any environment (browser, Node, etc.). Primarily for browser bundles and pure vanilla JS programs which will benefit from the maximum level of compression offered by the Closure Compiler. The **executable** ([see below](#how-does-the-universal-export-work-and-whats-exejs)) will be generated from the **universal** target output.

### How does the CLI export work?
The `bin` field of `package.json` points to `dist/cli.cjs` and uses the
`commander` package by default to provide an interactive command line interface.

gnv will generate `cli.js` with an example program when a new workspace is
created with `gnv create my-project-name`, and it will also initialize a GitHub
repository (or submodule, if you're in a git directory already) unless passed
the `-ng, --no-github` or `-ns, --no-submodule` flags respectively.

You will spend most of your time working running `my-project-name-dev` rather
than `my-project-name`, as the development version of the CLI will run the
source code in `exports/`, whereas the release version will point to the
compiled output at `dist/cli.cjs`.

#### CLI development
If you want to test live changes to the `exports/cli.js` file, a development
version of the CLI is linked to `my-package-dev`:

```console
$ my-package-dev
Logging without rebuilding!
```

Create a new project (linking to bin is done automatically):
```shell
gnv create my-package # use --no-github to skip GitHub integration
```

Enter the directory and build the project:
```shell
cd my-package && gnv build
```

Call your built program (`./dist/cli.cjs`):
```console
$ my-package
Hello world!
```

Check `exports/cli.js` to see what's happening behind the scenes. 

### How does the Node export work?
Node will `import` or `require` the appropriate compiled export file
(`dist/node.mjs` or `dist/node.cjs` respectively) in `dist/`. The following
settings allow for this:

* `.mjs` and `.cjs` extensions on built files for explicit specification of
  ES/CJS modules
* `"main": "dist/node.cjs"` in `package.json` for pre-13.2.0 compatibility
* `"exports": { ... }` in `package.json` to specify CJS and ESM export locations
  for post-13.2.0 `import`/`require` support
* `"type": "module` in `package.json` so ES6 `import`/`export` are available by
  default, i.e. for inside `lib/`

### How does the universal export work, and what's `exe.js`?
The **executable** output is generated from the **universal** target. While
**universal** specifies exports that can be `import`'d and `require`'d, `exe.js`
is the most compressed version of this module which exports nothing and aims to
only produce the same *side effects* as the `exports/universal.js`, removing any
unused code, mangling variable names, recursive inlining, and so on.

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

## How do I use third party modules if I want to keep my `package.json` free of dependencies? 
We're used to doing `yarn add [pkg]` / `npm install [pkg]` when we need to use a
new third party module in our project. However, since our outputs do not depend
on anything, we want to avoid adding any standard dependencies to package.json.
The only time dependencies are needed are if we're actively developing in the
workspace, or running the dev version of the CLI, or otherwise executing source
code directly (which will contain `import` and/or `require` statements). In this
case, we can bootstrap our workspace and download all needed dependencies with
`gnv boot`. The dev CLI source at `exports/cli.js` will then be functional and
ready for debugging.

## How do I add/install development dependencies?

| Package     | Description |
| ----------- | ----------- |
| `gnv add pkg[@latest]`    | Adds a package to package.json's `gnvDependencies` field. |
| `gnv add -P pkg[@latest]` | Adds a peer dependency to package.json's `peerDependencies` field. |
| `gnv boot`  | Installs all `gnvDependencies` in the local `node_modules/` without touching package.json using `npm i --no-save`, and installs all global `peerDependencies` with `npm i -g --no-save`, links all global peer dependencies into the local `node_modules/` with `npm link --no-save`.

Development dependencies for a gnv workspace can be added with `gnv add
my-dependency`, which installs the package globally with `npm i -g --no-save`
and then links in the workspace with `npm link`. It is also added to custom
field in package.json called `gnvDependencies`, which will be installed along
with `peerDependencies` on a call to `gnv boot` (which just calls a bootloader
script that installs all of the needed development dependencies specified in
package.json).

This workflow prevents us from needing to re-install the same dependencies over
and over in multiple folders, while assuring the dev build of a workspace freeze
will be consistent over time. The one caveat to this is that `gnv add pkg@1.0.0`
does not accept semantic versioning, only explicit versions or tags (i.e. `gnv
add pkg@latest`). 

You can always add dependencies locally rather than globally and ship the
package as-is, if your priorities are different. gnv will not modify
package.json except to bump the version and remove (then re-add) the development
CLI from package.json's `bin` field on `gnv publish`.

## How will my exports work with `require` and `import`?
The goal of gnv workspaces is full CJS/ESM interop, and `require` and `import`
should both expose your exports as expected thanks to Rollup. This allows for
distraction-free usage as seen below:

`ES6 | namedImportTest.mjs [PASSING]`
```javascript
import { TestA, TestB, TestC, TestDefault } from '../dist/universal.mjs';
```

`CJS | namedImportTest.cjs [PASSING]`
```javascript
const { TestA, TestB, TestC, TestDefault } = require('../dist/universal.cjs');
```

An additional small twist that gnv adds is, because it explicitly only ever
compiles exports, there will never really be a situation where the `default`
export would be empty by default, so if a `default` export is not defined, all
**named exports are exported as the `default` export**. This is a little ugly in
the source, and, using the gnv project itself as an example, looks like:

#### Generated development bundle at `dev/node.mjs`
```javascript
// expose as named exports
export { callCompiler, checkInsideProject, compile, create, devCompile, develop, displayProjectInfo, initialize };

// expose all as default export
export default { callCompiler, checkInsideProject, compile, create, devCompile, develop, displayProjectInfo, initialize };
```

This can be overridden by setting a `default` export manually. A large
motivation of this is so that the form `import pkg from ...` can be used instead
of `import * as pkg from ...`, and it allows for predictable coding patterns:

#### ESM `import`
```javascript
// default (all)
import gnv from './dev/node.mjs';
// named
import { callCompiler } from './dev/node.mjs';

console.log({
  gnv,
  callCompiler,
});
```

#### CJS `require`
```javascript
// default (all)
const gnv = require('./dev/node.cjs');
// named
const { callCompiler } = require('./dev/node.cjs');

console.log({
  gnv,
  callCompiler,
});
```

Running in Node to compare outputs:

`$ node test.cjs`
```javascript
{
  gnv: {
    callCompiler: [AsyncFunction: callCompiler],
    checkInsideProject: [Function: checkInsideProject],
    compile: [AsyncFunction: compile],
    create: [AsyncFunction: create],
    devCompile: [AsyncFunction: devCompile],
    develop: [AsyncFunction: develop],
    displayProjectInfo: [Function: displayProjectInfo],
    initialize: [AsyncFunction: initialize]
  },
  callCompiler: [AsyncFunction: callCompiler]
}
```
`$ node test.mjs`
```javascript
{
  gnv: {
    callCompiler: [AsyncFunction: callCompiler],
    checkInsideProject: [Function: checkInsideProject],
    compile: [AsyncFunction: compile],
    create: [AsyncFunction: create],
    devCompile: [AsyncFunction: devCompile],
    develop: [AsyncFunction: develop],
    displayProjectInfo: [Function: displayProjectInfo],
    initialize: [AsyncFunction: initialize]
  },
  callCompiler: [AsyncFunction: callCompiler]
}
```

Everything works as expected! The default and named exports for CJS and ESM
outputs are functionally identical.

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
that they will actually be executing. A call to `gnv boot` will allow a
developer to install the global and local dependencies needed to run the source
without adding them to package.json's standard dependency fields. 
