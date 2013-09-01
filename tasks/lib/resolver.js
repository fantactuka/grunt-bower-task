var path = require('path'),
    grunt = require('grunt'),
    _ = grunt.util._,
    Matcher = require('./matcher');

// Trying to find override for particular component
function findOverride(componentName, overrides) {
  return _.find(overrides, function(override, key) {
    return Matcher.matches(componentName, key);
  });
}

// Put components list and overrides (which in fact are juts filter out needed files from
// components files list) and get resolved { component -> [files list] } path map.
//
// Note that it will only return files list without dirs
function resolvePaths(componentsPath, components, overrides) {
  return _.reduce(components, function(results, componentFiles, componentName) {

    // Getting override for the component
    var override = findOverride(componentName, overrides),
        componentPath = path.join(componentsPath, componentName),
        resolve = function(file) {
          return path.resolve(componentPath, file);
        };

    // Getting only needed files (from override) or all components files if no override
    var files = grunt.file.expand({ cwd: componentPath }, override || componentFiles);

    // Getting expanded files list with abs path for the component
    results[componentName] = files.reduce(function(memo, file) {

      file = resolve(file);

      // Expand into files list if it's path. We also filtering to get only files while expanding
      // since we don't need any dirs references in output
      var files = grunt.file.isDir(file) ?
          grunt.file.expand({ cwd: file, filter: 'isFile' }, '**/*').map(resolve) :
          [file];

      return memo.concat(files);
    }, []);

    return results;
  }, {});
}

module.exports = {
  resolvePaths: resolvePaths
};
