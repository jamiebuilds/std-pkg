// @flow
'use strict';

const detectIndent = require('detect-indent');
const parseJson = require('parse-json');
const path = require('path');
const is = require('sarcastic');

/**
 * Complex assertions
 */

const isRepository = is.either(
  is.string,
  is.shape({
    type: is.maybe(is.string),
    url: is.string,
  }),
);

const isMaintainer = is.either(
  is.string,
  is.shape({
    name: is.maybe(is.string),
    email: is.maybe(is.string),
    url: is.maybe(is.string),
  }),
);

const isWorkspaces = is.either(
  is.arrayOf(is.string),
  is.shape({
    packages: is.maybe(is.arrayOf(is.string)),
    nohoist: is.maybe(is.arrayOf(is.string)),
  }),
);

/**
 * Package
 */

class Package {
  constructor(filePath /*: string */, fileContents /*: string */) {
    this._filePath = is(filePath, is.string, 'filePath');
    this._fileContents = is(fileContents, is.string, 'fileContents');
  }

  /**
   * Paths
   */

  get filePath() {
    return this._filePath;
  }

  get dirPath() {
    return path.dirname(this.filePath);
  }

  get nodeModulesPath() {
    return path.join(this.dirPath, 'node_modules');
  }

  get nodeModulesBinPath() {
    return path.join(this.nodeModulesPath, '.bin');
  }

  get nodeModulesCachePath() {
    return path.join(this.nodeModulesPath, '.cache');
  }

  /**
   * Contents
   */

  get fileContents() {
    return this._fileContents;
  }

  get json() {
    if (!this._json) {
      this._json = parseJson(this.fileContents);
    }
    return is(this._json, is.object, 'package.json');
  }

  get indentation() /*: string */ {
    if (!this._indentation) {
      this._indentation = detectIndent(this.fileContents).indent;
    }
    return this._indentation || '  ';
  }

  /**
   * Essentials
   */

  get name() {
    return is(this.json.name, is.maybe(is.string), 'package.json#name');
  }

  get version() {
    return is(this.json.version, is.maybe(is.string), 'package.json#version');
  }

  /**
   * Info
   */

  get description() {
    return is(this.json.description, is.maybe(is.string), 'package.json#description');
  }

  get keywords() {
    return is(this.json.keywords, is.maybe(is.arrayOf(is.string)), 'package.json#keywords');
  }

  get license() {
    return is(this.json.license, is.maybe(is.string), 'package.json#license');
  }

  /**
   * Links
   */

  get homepage() {
    return is(this.json.homepage, is.maybe(is.string), 'package.json#homepage');
  }

  get bugs() {
    return is(this.json.bugs, is.maybe(is.string), 'package.json#bugs');
  }

  get repository() {
    return is(this.json.repository, is.maybe(isRepository), 'package.json#repository');
  }

  /**
   * Maintainers
   */

  get author() {
    return is(this.json.author, is.maybe(isMaintainer), 'package.json#author')
  }

  get contributors() {
    return is(this.json.contributors, is.maybe(is.arrayOf(isMaintainer)), 'package.json#contributors');
  }

  /**
   * Files
   */

  get files() {
    return is(this.json.files, is.maybe(is.arrayOf(is.string)), 'package.json#files');
  }

  get main() {
    return is(this.json.main, is.maybe(is.string), 'package.json#main');
  }

  get bin() {
    return is(this.json.bin, is.maybe(is.either(is.string, is.objectOf(is.string))), 'package.json#bin');
  }

  get man() {
    return is(this.json.man, is.maybe(is.either(is.string, is.arrayOf(is.string))), 'package.json#man');
  }

  get directories() {
    return is(this.json.directories, is.maybe(is.objectOf(is.string)), 'package.json#directories');
  }

  /**
   * Tasks
   */

  get scripts() {
    return is(this.json.scripts, is.maybe(is.objectOf(is.string)), 'package.json#scripts');
  }

  get config() {
    return is(this.json.config, is.maybe(is.object), 'package.json#config');
  }

  /**
   * Dependencies
   */

  get dependencies() {
    return is(this.json.dependencies, is.maybe(is.objectOf(is.string)), 'package.json#dependencies');
  }

  get devDependencies() {
    return is(this.json.devDependencies, is.maybe(is.objectOf(is.string)), 'package.json#devDependencies');
  }

  get peerDependencies() {
    return is(this.json.peerDependencies, is.maybe(is.objectOf(is.string)), 'package.json#peerDependencies');
  }

  get optionalDependencies() {
    return is(this.json.optionalDependencies, is.maybe(is.objectOf(is.string)), 'package.json#optionalDependencies');
  }

  get bundledDependencies() {
    return is(this.json.bundledDependencies, is.maybe(is.arrayOf(is.string)), 'package.json#bundledDependencies');
  }

  /**
   * System
   */

  get engines() {
    return is(this.json.engines, is.maybe(is.objectOf(is.string)), 'package.json#engines');
  }

  get os() {
    return is(this.json.os, is.maybe(is.arrayOf(is.string)), 'package.json#os');
  }

  get cpu() {
    return is(this.json.cpu, is.maybe(is.arrayOf(is.string)), 'package.json#cpu');
  }

  /**
   * Publishing
   */

  get private() {
    return is(this.json.private, is.maybe(is.boolean), 'package.json#private');
  }

  get publishConfig() {
    return is(this.json.publishConfig, is.maybe(is.object), 'package.json#publishConfig');
  }

  /**
   * Yarn
   */

  get flat() {
    return is(this.json.flat, is.maybe(is.boolean), 'package.json#flat');
  }

  get resolutions() {
    return is(this.json.resolutions, is.maybe(is.objectOf(is.string)), 'package.json#resolutions');
  }

  get workspaces() {
    return is(this.json.workspaces, is.maybe(isWorkspaces), 'package.json#workspaces');
  }

  /**
   * Bundlers
   */

  get module() {
    return is(this.json.module, is.maybe(is.string), 'package.json#module');
  }

  get browser() {
    return is(this.json.browser, is.maybe(is.string), 'package.json#browser');
  }

  get source() {
    return is(this.json.source, is.maybe(is.string), 'package.json#source');
  }

  get sideEffects() {
    return is(this.json.sideEffects, is.maybe(is.boolean), 'package.json#sideEffects');
  }

  /**
   * TypeScript
   */

  get types() {
    return is(this.json.types, is.maybe(is.string), 'package.json#types');
  }
}

module.exports = Package;
