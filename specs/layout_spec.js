'use strict';
/* jshint expr: true */
/* global describe:false, it:false */

var expect = require('chai').expect,
    path = require('path'),
    grunt = require('grunt'),
    Layout = require('../tasks/lib/layout');

describe('Layout', function() {
  var component = 'foo',
      filePath = 'bar/baz.css',
      fileName = 'baz.css',
      check = function(layout, expectedPath) {
        expect(layout(component, filePath, fileName)).to.equal(expectedPath);
      };

  describe('built-in layouts', function() {
    describe('#byComponent', function() {
      it('returns path', function() {
        var layout = Layout.get('byComponent');
        check(layout, 'foo/baz.css');
      });
    });

    describe('#byExtension', function() {
      it('returns path', function() {
        var layout = Layout.get('byExtension');
        check(layout, 'css/foo/baz.css');
      });
    });

    describe('#byType', function() {
      it('returns path', function() {
        var layout = Layout.get('byType');
        check(layout, 'styles/foo/baz.css');
      });
    });
  });

  describe('custom layout', function() {
    it('returns processed path', function() {
      var custom = function(component, filePath, fileName) {
        return path.join(component, 'custom-' + fileName);
      };

      check(Layout.get(custom), 'foo/custom-baz.css');
    });
  });
});
