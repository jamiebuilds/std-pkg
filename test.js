// @flow
'use strict';

const test = require('ava');
const path = require('path');
const Package = require('./');

const PKG_PATH = '/path/to/package.json';
const PKG_JSON = {
  name: 'example',
  version: '1.0.0',
};
const PKG_INDENTATION = '  ';
const PKG_CONTENTS = JSON.stringify(PKG_JSON, null, PKG_INDENTATION);

function pkg(json = PKG_JSON, indentation = PKG_INDENTATION) {
  return new Package(PKG_PATH, JSON.stringify(json, null, indentation));
}

test('Package', t => {
  t.throws(() => new Package(null, PKG_CONTENTS));
  t.throws(() => new Package(PKG_PATH, null));
  t.notThrows(() => new Package(PKG_PATH, PKG_CONTENTS));
});

test('paths', t => {
  t.is(pkg().filePath, PKG_PATH);
  t.is(pkg().dirPath, path.dirname(PKG_PATH));
  t.is(pkg().nodeModulesPath, path.join(path.dirname(PKG_PATH), 'node_modules'));
  t.is(pkg().nodeModulesBinPath, path.join(path.dirname(PKG_PATH), 'node_modules', '.bin'));
  t.is(pkg().nodeModulesCachePath, path.join(path.dirname(PKG_PATH), 'node_modules', '.cache'));
});

test('contents', t => {
  t.is(pkg().fileContents, PKG_CONTENTS);
  t.deepEqual(pkg().json, PKG_JSON);
  t.deepEqual(pkg().indentation, PKG_INDENTATION);
});

test('name', t => {
  t.is(pkg({}).name, null);
  t.is(pkg({ name: 'std-pkg' }).name, 'std-pkg');
  t.throws(() => pkg({ name: 42 }).name);
});

test('version', t => {
  t.is(pkg({}).version, null);
  t.is(pkg({ version: '1.0.0' }).version, '1.0.0');
  t.throws(() => pkg({ version: 42 }).version);
});

test('description', t => {
  t.is(pkg({}).description, null);
  t.is(pkg({ description: 'does thing' }).description, 'does thing');
  t.throws(() => pkg({ description: 42 }).description);
});

test('keywords', t => {
  t.is(pkg({}).keywords, null);
  t.deepEqual(pkg({ keywords: ['thing'] }).keywords, ['thing']);
  t.throws(() => pkg({ keywords: 42 }).keywords);
  t.throws(() => pkg({ keywords: [42] }).keywords);
});

test('license', t => {
  t.is(pkg({}).license, null);
  t.is(pkg({ license: 'MIT' }).license, 'MIT');
  t.throws(() => pkg({ license: 42 }).license);
});

test('homepage', t => {
  t.is(pkg({}).homepage, null);
  t.is(pkg({ homepage: 'https://example.com' }).homepage, 'https://example.com');
  t.throws(() => pkg({ homepage: 42 }).homepage);
});

test('bugs', t => {
  t.is(pkg({}).bugs, null);
  t.is(pkg({ bugs: 'https://example.com/bugs' }).bugs, 'https://example.com/bugs');
  t.throws(() => pkg({ bugs: 42 }).bugs);
});

test('repository', t => {
  t.is(pkg({}).repository, null);
  t.is(pkg({ repository: 'https://example.com/repository' }).repository, 'https://example.com/repository');
  t.deepEqual(pkg({ repository: { url: 'https://example.com/repository' } }).repository, { type: null, url: 'https://example.com/repository' });
  t.throws(() => pkg({ repository: 42 }).repository);
  t.throws(() => pkg({ repository: {} }).repository);
});

test('author', t => {
  t.is(pkg({}).author, null);
  t.is(pkg({ author: 'Person <person@example.com> (https://example.com/person)' }).author, 'Person <person@example.com> (https://example.com/person)');
  t.deepEqual(pkg({ author: { name: 'Person' } }).author, { name: 'Person', email: null, url: null });
  t.deepEqual(pkg({ author: { email: 'person@example.com' } }).author, { name: null, email: 'person@example.com', url: null });
  t.deepEqual(pkg({ author: { url: 'https://example.com/person' } }).author, { name: null, email: null, url: 'https://example.com/person' });
  t.throws(() => pkg({ author: 42 }).author);
  t.throws(() => pkg({ author: { name: 42 } }).author);
  t.throws(() => pkg({ author: { email: 42 } }).author);
  t.throws(() => pkg({ author: { url: 42 } }).author);
});

test('contributors', t => {
  t.is(pkg({}).contributors, null);
  t.deepEqual(pkg({ contributors: ['Person <person@example.com> (https://example.com/person)'] }).contributors, ['Person <person@example.com> (https://example.com/person)']);
  t.deepEqual(pkg({ contributors: [{ name: 'Person' }] }).contributors, [{ name: 'Person', email: null, url: null }]);
  t.deepEqual(pkg({ contributors: [{ email: 'person@example.com' }] }).contributors, [{ name: null, email: 'person@example.com', url: null }]);
  t.deepEqual(pkg({ contributors: [{ url: 'https://example.com/person' }] }).contributors, [{ name: null, email: null, url: 'https://example.com/person' }]);
  t.throws(() => pkg({ contributors: 42 }).contributors);
  t.throws(() => pkg({ contributors: [42] }).contributors);
  t.throws(() => pkg({ contributors: [{ name: 42 }] }).contributors);
  t.throws(() => pkg({ contributors: [{ email: 42 }] }).contributors);
  t.throws(() => pkg({ contributors: [{ url: 42 }] }).contributors);
});

test('files', t => {
  t.is(pkg({}).files, null);
  t.deepEqual(pkg({ files: ['index.js'] }).files, ['index.js']);
  t.throws(() => pkg({ files: 42 }).files);
  t.throws(() => pkg({ files: [42] }).files);
});

test('main', t => {
  t.is(pkg({}).main, null);
  t.is(pkg({ main: './dist/main/index.js' }).main, './dist/main/index.js');
  t.throws(() => pkg({ main: 42 }).main);
});

test('bin', t => {
  t.is(pkg({}).bin, null);
  t.is(pkg({ bin: './bin' }).bin, './bin');
  t.deepEqual(pkg({ bin: { cli: './bin' } }).bin, { cli: './bin' });
  t.throws(() => pkg({ bin: 42 }).bin);
  t.throws(() => pkg({ bin: { cli: 42 } }).bin);
});

test('man', t => {
  t.is(pkg({}).man, null);
  t.is(pkg({ man: './man.0' }).man, './man.0');
  t.throws(() => pkg({ man: 42 }).man);
});

test('directories', t => {
  t.is(pkg({}).directories, null);
  t.deepEqual(pkg({ directories: { example: 'path/to/example/' } }).directories, { example: 'path/to/example/' });
  t.throws(() => pkg({ directories: 42 }).directories);
  t.throws(() => pkg({ directories: { example: 42 } }).directories);
});

test('scripts', t => {
  t.is(pkg({}).scripts, null);
  t.deepEqual(pkg({ scripts: { build: 'babel src -d dist' } }).scripts, { build: 'babel src -d dist' });
  t.throws(() => pkg({ scripts: 42 }).scripts);
  t.throws(() => pkg({ scripts: { build: 42 } }).scripts);
});

test('config', t => {
  t.is(pkg({}).config, null);
  t.deepEqual(pkg({ config: { port: 8080 } }).config, { port: 8080 });
  t.throws(() => pkg({ config: 42 }).config);
});

function dependencies(t, field) {
  t.is(pkg({})[field], null);
  t.deepEqual(pkg({ [field]: { 'package': '^1.0.0' } })[field], { 'package': '^1.0.0' });
  t.throws(() => pkg({ [field]: 42 })[field]);
  t.throws(() => pkg({ [field]: { 'package': 42 } })[field]);
}

test('dependencies', dependencies, 'dependencies');
test('devDependencies', dependencies, 'devDependencies');
test('peerDependencies', dependencies, 'peerDependencies');
test('optionalDependencies', dependencies, 'optionalDependencies');

test('bundledDependencies', t => {
  t.is(pkg({}).bundledDependencies, null);
  t.deepEqual(pkg({ bundledDependencies: ['package'] }).bundledDependencies, ['package']);
  t.throws(() => pkg({ bundledDependencies: 42 }).bundledDependencies);
  t.throws(() => pkg({ bundledDependencies: [42] }).bundledDependencies);
});

test('engines', t => {
  t.is(pkg({}).engines, null);
  t.deepEqual(pkg({ engines: { node: '>=8.0.0' } }).engines, { node: '>=8.0.0' });
  t.throws(() => pkg({ engines: 42 }).engines);
  t.throws(() => pkg({ engines: { node: 42 } }).engines);
});

test('os', t => {
  t.is(pkg({}).os, null);
  t.deepEqual(pkg({ os: ['darwin', 'linux'] }).os, ['darwin', 'linux']);
  t.throws(() => pkg({ os: 42 }).os);
  t.throws(() => pkg({ os: [42] }).os);
});

test('cpu', t => {
  t.is(pkg({}).cpu, null);
  t.deepEqual(pkg({ cpu: ['x64', 'ia32'] }).cpu, ['x64', 'ia32']);
  t.throws(() => pkg({ cpu: 42 }).cpu);
  t.throws(() => pkg({ cpu: [42] }).cpu);
});

test('private', t => {
  t.is(pkg({}).private, null);
  t.is(pkg({ private: true }).private, true);
  t.throws(() => pkg({ private: 42 }).private);
});

test('publishConfig', t => {
  t.is(pkg({}).publishConfig, null);
  t.deepEqual(pkg({ publishConfig: { registry: 'http://my-internal-registry.local' } }).publishConfig, { registry: 'http://my-internal-registry.local' });
  t.throws(() => pkg({ publishConfig: 42 }).publishConfig);
});

test('flat', t => {
  t.is(pkg({}).flat, null);
  t.is(pkg({ flat: true }).flat, true);
  t.throws(() => pkg({ flat: 42 }).flat);
});

test('resolutions', t => {
  t.is(pkg({}).resolutions, null);
  t.deepEqual(pkg({ resolutions: { 'package': '1.0.0' } }).resolutions, { 'package': '1.0.0' });
  t.throws(() => pkg({ resolutions: 42 }).resolutions);
  t.throws(() => pkg({ resolutions: { 'package': 42 } }).resolutions);
});

test('workspaces', t => {
  t.is(pkg({}).workspaces, null);
  t.deepEqual(pkg({ workspaces: ['packages/*'] }).workspaces, ['packages/*']);
  t.deepEqual(pkg({ workspaces: { packages: ['packages/*'] } }).workspaces, { packages: ['packages/*'], nohoist: null });
  t.deepEqual(pkg({ workspaces: { nohoist: ['package'] } }).workspaces, { packages: null, nohoist: ['package'] });
  t.throws(() => pkg({ workspaces: 42 }).workspaces);
  t.throws(() => pkg({ workspaces: { packages: 42 } }).workspaces);
  t.throws(() => pkg({ workspaces: { nohoist: 42 } }).workspaces);
});

test('module', t => {
  t.is(pkg({}).module, null);
  t.is(pkg({ module: './dist/module/index.js' }).module, './dist/module/index.js');
  t.throws(() => pkg({ module: 42 }).module);
});

test('browser', t => {
  t.is(pkg({}).browser, null);
  t.is(pkg({ browser: './dist/browser/index.js' }).browser, './dist/browser/index.js');
  t.throws(() => pkg({ browser: 42 }).browser);
});

test('source', t => {
  t.is(pkg({}).source, null);
  t.is(pkg({ source: './src/index.js' }).source, './src/index.js');
  t.throws(() => pkg({ source: 42 }).source);
});

test('sideEffects', t => {
  t.is(pkg({}).sideEffects, null);
  t.is(pkg({ sideEffects: true }).sideEffects, true);
  t.throws(() => pkg({ sideEffects: 42 }).sideEffects);
});

test('types', t => {
  t.is(pkg({}).types, null);
  t.is(pkg({ types: './types.ts' }).types, './types.ts');
  t.throws(() => pkg({ types: 42 }).types);
});
