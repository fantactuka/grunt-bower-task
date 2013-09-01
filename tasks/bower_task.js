/*
 * grunt-bower-task
 * https://github.com/yatskevich/grunt-bower-task
 *
 * Copyright (c) 2012 Ivan Yatskevich
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var bower = require('bower'),
      path = require('path'),
      async = require('async'),
      colors = require('colors'),
      rimraf = require('rimraf').sync,
      Layout = require('./lib/layout'),
      Resolver = require('./lib/resolver'),
      Copier = require('./lib/copier');

  function log(message) {
    log.logger.writeln(message);
  }

  function fail(error) {
    grunt.fail.fatal(error);
  }

  function clean(dir, callback) {
    rimraf(dir);
    callback();
  }

  function install(callback) {
    bower.commands.install()
        .on('log', function(result) {
          log(['bower', result.id.cyan, result.message].join(' '));
        })
        .on('error', fail)
        .on('end', callback);
  }

  function copy(options, callback) {
    bower.commands
        .list({ paths: true })
        .on('end', function(components) {
          var bowerCwd = bower.config.cwd,
              bowerJson = path.join(bowerCwd, 'bower.json'),
              json = grunt.file.readJSON(bowerJson),
              targetPath = path.resolve('lib'),
              componentsPath = path.join(bowerCwd, bower.config.directory),
              overrides = json.exportsOverride || {},
              resolvedComponents = Resolver.resolvePaths(componentsPath, components, overrides),
              layout = Layout.get(options.layout);

          Copier.copy(componentsPath, resolvedComponents, targetPath, layout);

          callback();
        });
  }

  grunt.registerMultiTask('bower', 'Install Bower packages.', function() {
    var tasks = [],
        done = this.async(),
        options = this.options({
          cleanTargetDir: false,
          cleanBowerDir: false,
          targetDir: './lib',
          layout: 'byComponent',
          install: true,
          verbose: false,
          copy: false
        }),
        add = function(name, fn) {
          tasks.push(function(callback) {
            grunt.log.ok(name);
            fn(function() {
              callback();
            });
          });
        },
        bowerDir = path.resolve(bower.config.directory),
        targetDir = path.resolve(options.targetDir);

    log.logger = options.verbose ? grunt.log : grunt.verbose;
    options.cwd = grunt.option('base') || process.cwd();

    if (options.cleanup !== undefined) {
      options.cleanTargetDir = options.cleanBowerDir = options.cleanup;
    }

    if (options.cleanTargetDir) {
      add('Clean target dir ' + targetDir.grey, function(callback) {
        clean(targetDir, callback);
      });
    }

    if (options.install) {
      add('Install bower packages', install);
    }

    if (options.copy) {
      add('Copy packages to ' + targetDir.grey, function(callback) {
        copy(options, callback);
      });
    }

    if (options.cleanBowerDir) {
      add('Clean bower dir ' + bowerDir.grey, function(callback) {
        clean(bowerDir, callback);
      });
    }

    async.series(tasks, done);
  });
};
