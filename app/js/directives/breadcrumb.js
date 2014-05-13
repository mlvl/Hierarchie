  /* Bread crumb display directive
   *
   * This code was modified from the example found at http://bl.ocks.org/kerryrodden/7090426
   * which is covered by the Apache v2.0 License. A copy of this license is as follows:
   *    --- BEGIN ---
   *    Copyright 2013 Google Inc. All Rights Reserved.
   *
   *    Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   *    Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
   *  --- END ---
   * Developers: Do not remove this notification or license.
   */
  angular.module('hierarchie.directives')
    .directive('breadcrumb', [
      function() {
        return {
          restrict: 'A',
          scope: {
            data: "=",
            currentnode: "="
          },
          link: function(scope) {

            var b, mobileDisplay;

            scope.$on('updateBreadcrumb', function(ev, node, sequenceArray) {
              updateBreadcrumbs(sequenceArray, node.words[0]);
            });

            scope.$on('hideBreadcrumb', function() {
              d3.select("#trail")
                .style("visibility", "hidden");
            });

            scope.$watch(function() {
              return d3.select("#viz_panel")[0][0].clientWidth;
            }, function(ev) {
              d3.select('#trail').remove();
              setup();
            });

            function setup() {
              var width = d3.select("#viz_panel")[0][0].clientWidth;
              mobileDisplay = d3.select("body")[0][0].clientWidth < 990;
              // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
              b = {
                w: 100,
                h: 40,
                s: 3,
                t: 10
              };
              if (mobileDisplay) {
                b = {
                  w: 60,
                  h: 30,
                  s: 3,
                  t: 10
                };
              }

              // Add the svg area.
              d3.select("#sequence").append("svg:svg")
                .attr("width", width)
                .attr("height", b.h)
                .attr("id", "trail");
            }

            setup();

            // Generate a string that describes the points of a breadcrumb polygon.
            function breadcrumbPoints(d, i) {
              var points = [];
              points.push("0,0");
              points.push(b.w + ",0");
              if (d.children) // non-pointed end for terminal nodes
                points.push(b.w + b.t + "," + (b.h / 2));
              points.push(b.w + "," + b.h);
              points.push("0," + b.h);
              if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                points.push(b.t + "," + (b.h / 2));
              }
              return points.join(" ");
            }
            // Update the breadcrumb trail to show the current sequence and percentage.
            function updateBreadcrumbs(nodeArray, percentageString) {
              // Data join; key function combines name and depth (= position in sequence).
              var g = d3.select("#trail")
                .selectAll("g")
                .data(nodeArray, function(d) {
                  return d.words[0] + d.depth;
                });

              // Add breadcrumb and label for entering nodes.
              var entering = g.enter().append("svg:g");

              entering.append("svg:polygon")
                .attr("points", breadcrumbPoints)
                .style("fill", function(d) {
                  return d.color;
                });

              entering.append("svg:text")
                .attr("x", (b.w + b.t) / 2)
                .attr("y", b.h / 2)
                .attr("dy", "0.35em")
                .attr("font-size", mobileDisplay ? "12" : "14")
                .attr("text-anchor", "middle")
                .text(function(d) {
                  return d.words[0];
                });

              // Set position for entering and updating nodes.
              g.attr("transform", function(d, i) {
                return "translate(" + i * (b.w + b.s) + ", 0)";
              });

              // Remove exiting nodes.
              g.exit().remove();

              // Make the breadcrumb trail visible, if it's hidden.
              d3.select("#trail")
                .style("visibility", "");
            }
          }
        };
      }
    ]);