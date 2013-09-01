module.exports = {

  /**
   * @param component - Bower component name
   * @param override - can be an exact package name, simplified wildcard or true RegExp
   * @returns {boolean}
   */
  matches: function(component, override) {
    if (component === override) {
      return true;
    }

    if (override.match(/^\/.*\/$/)) {
      var trueRegexMatcher = new RegExp(override.replace(/^\/|\/$/g, ''));
      return trueRegexMatcher.test(component);
    }

    if (override.indexOf('*') >= 0) {
      override = override.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, '\\$&').replace('*', '.+');
      var wildcardMatcher = new RegExp(override);
      return wildcardMatcher.test(component);
    }

    return false;
  }

};
