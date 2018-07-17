# std-pkg

> The Official `package.json` Standard™ for Npm® endorsed fields†

- Lazily asserts Correct™ values using getters
- Strongly typed
- Includes community standards

This is useful if you're writing tooling around `package.json` and want to make
sure you are following the Official NPM `package.json` Standard™.

## Install

```sh
yarn add std-pkg
```

## Usage

```js
const Package = require('std-pkg');
const fs = require('fs');

let pkgPath = '/path/to/package.json';
let pkgContents = fs.readFileSync('/path/to/package.json', 'utf-8');

let pkg = new Package(pkgPath, pkgContents);

// file paths
pkg.filePath;
pkg.dirPath;
pkg.nodeModulesPath;
pkg.nodeModulesBinPath;
pkg.nodeModulesCachePath;

// file contents
pkg.fileContents;
pkg.json;
pkg.indentation;

// essentials
pkg.name;
pkg.version;

// info
pkg.description;
pkg.keywords;
pkg.license;

// links
pkg.homepage;
pkg.bugs;
pkg.repository;

// maintainers
pkg.author;
pkg.contributors;

// files
pkg.files;
pkg.main;
pkg.bin;
pkg.man;
pkg.directories;

// tasks
pkg.scripts;
pkg.config;

// dependencies
pkg.dependencies;
pkg.devDependencies;
pkg.peerDependencies;
pkg.optionalDependencies;
pkg.bundledDependencies;

// system
pkg.engines;
pkg.os;
pkg.cpu;

// publishing
pkg.private;
pkg.publishConfig;

// yarn
pkg.flat;
pkg.resolutions;
pkg.workspaces;

// bundlers
pkg.module;
pkg.browser;
pkg.source;
pkg.sideEffects;

// typescript
pkg.types;
```

Read [index.js](./index.js) and [test.js](./test.js) for valid values for each
field.

---

> † This is not really a "standard", npm peeps are just being douchebags about
> anyone ever trying to standardize things because they as a private company
> would like to retain control which is the same reason npm is not open source.
