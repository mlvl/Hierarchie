/* Services */

angular.module('hierarchie.services', [])
  .value('version', '0.1')
  // Some standard D3 mouse events
  .service('mouseevents', function() {
    this.mouseover = function(d3, data, color, item) {
      d3.select(item).style("fill", color);
    };
    this.mouseout = function(d3, color, item) {
      d3.select(item).style("fill", color);
    };
    this.click = function(d) {
      console.log(d.color);
    };
  })
  // Node related functions used by multiple visualizations
  .service('nodeService', function() {
    // Returns all a node's children to the leaf level
    this.getChildren = function(node) {
      var children = [];

      function addChild(root) {
        children.push(root);
        _.each(root.children, function(c) {
          addChild(c);
        });
      };
      addChild(node);
      return children;
    };
    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
    this.getAncestors = function(node) {
      var path = [];
      var current = node;
      while (current) {
        path.unshift(current);
        current = current.parent;
      }
      return path;
    };
    // Returns the ancestors of a node without the root node
    this.getAncestorsWithoutRoot = function(node) {
      var path = [];
      var current = node;
      while (current.parent) {
        path.unshift(current);
        current = current.parent;
      }
      return path;
    };
  })
  // Clears SVGs and displays from the DOM
  .service('clear', function() {
    this.all = function(d3) {
      d3.selectAll('.chart').remove();
      d3.select('.sunburst-svg').remove();
      d3.select('.partition-svg').remove();
    };
  })
  // Formats words for display
  .service('wordFormat', function() {
    this.formatWords = function(words, display) {
      var pretty_words = "";
      _.each(words, function(word, i) {
        pretty_words += "<span class='" + display + " word w" + i + "'>" + word + "</span><br>";
      });
      return pretty_words;
    };
    this.singleWord = function(depth, words) {
      return "<span class='word single'>" + words[0] + "</span>";
    };
    this.plainFormatWords = function(words) {
      var pretty_words = "";
      _.each(words, function(word) {
        pretty_words += word + " ";
      });
      return pretty_words;
    };
  });