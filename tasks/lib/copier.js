var path = require('path'),
    grunt = require('grunt'),
    _ = grunt.util._;

function copy(componentsPath, components, targetPath, layout) {
  _.each(components, function(componentFiles, componentName) {

    var componentPath = path.join(componentsPath, componentName);

    _.each(componentFiles, function(file) {
      var filePath = path.relative(componentPath, file),
          fileName = path.basename(file),
          destFile = layout(componentName, filePath, fileName);

      // Allow layout to skip the file from being copied
      if (destFile !== false) {
        destFile = path.resolve(targetPath, destFile);
        grunt.log.writeln('Copy ' + file.cyan + ' to ' + destFile.cyan);
        grunt.file.copy(file, destFile);
      }
    });
  });
}

module.exports = {
  copy: copy
};