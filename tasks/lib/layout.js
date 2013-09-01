var path = require('path'),
    grunt = require('grunt'),
    _ = grunt.util._;

var layouts = {
  byComponent: function(componentName, filePath, fileName) {
    return path.join(componentName, fileName);
  },

  byExtension: function(componentName, filePath, fileName) {
    var ext = path.extname(fileName).replace(/^\./, '') || 'none';
    return path.join(ext, componentName, fileName);
  },

  byType: function(componentName, filePath, fileName) {
    var ext = path.extname(fileName).replace(/^\./, ''),
        is = function() {
          return [].slice.call(arguments).indexOf(ext) >= 0;
        },
        type;

    if (is('less', 'css', 'sass')) {
      type = 'styles';
    }

    if (is('png', 'jpg', 'jpeg', 'ico', 'gif')) {
      type = 'images';
    }

    if (is('js', 'coffee')) {
      type = 'javascripts';
    }

    // If file does not match any of types above - skip it
    return type ? path.join(type, componentName, fileName) : false;
  }
};

var fail = function(layoutName) {
  grunt.fail.fatal(
      'Invalid layout: ' + layoutName + '. Layout should be one of default layouts or a function.\n' +
      'Available layouts: ' + _.keys(layouts).join(', ')
  );
};

module.exports = {
  get: function(layoutName) {
    var layout = typeof layoutName === 'function' ? layoutName : layouts[layoutName];
    return layout || fail(layoutName);
  }
};