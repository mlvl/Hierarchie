/* Sunburst display directive
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
  .directive('sunburst', ['$rootScope', 'wordFormat', 'clear', 'nodeService', 'mouseevents',
    function($rootScope, wordFormat, clear, nodeService, mouseevents) {
      return {
        restrict: 'A',
        scope: {
          data: "="
        },
        link: function(scope) {
          var currentRoot;

          // Watch for changes in data
          scope.$watch('data', function(newVals) {
            if (newVals)
              return render(newVals);
            else
              return;
          }, false);

          // Listener to trigger render
          scope.$on('renderSunburst', function(ev) {
            clear.all(d3);
            d3.select('#sunburst_layout').attr("class", "option selected");
            d3.select('#partition_layout').attr("class", "option");
            render(scope.data);
          });

          // Watch for resize event & re render
          scope.$watch(function() {
            return d3.select("#viz_panel")[0][0].clientWidth;
          }, function(ev) {
            if (scope.data && currentRoot) {
              d3.select('.sunburst-svg').remove();
              render(currentRoot);
            }
          });

          // Renders the sunburst with current dataset
          function render(root) {
            // Dimensions of sunburst.
            var margin = 140;
            var mobileDisplay = d3.select("body")[0][0].clientWidth < 990;
            var wordMargin = 100;
            if (mobileDisplay)
              wordMargin = 50;
            var width = d3.select("#viz_panel")[0][0].clientWidth - (margin / 2);
            var height = angular.element(window)[0].innerHeight - margin;
            var radius = Math.min(width, height) / 2;
            var x = d3.scale.linear()
              .range([0, 2 * Math.PI]);
            var y = d3.scale.sqrt()
              .range([0, radius]);

            currentRoot = root;

            var vis = d3.select("#sunburst").append("svg:svg")
              .attr("class", "sunburst-svg")
              .attr("width", width)
              .attr("height", height)
              .append("svg:g")
              .attr("id", "container")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var partition = d3.layout.partition()
              .value(function(d) {
                return d.depth;
              });

            var arc = d3.svg.arc()
              .startAngle(function(d) {
                return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
              })
              .endAngle(function(d) {
                return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
              })
              .innerRadius(function(d) {
                return Math.max(0, y(d.y));
              })
              .outerRadius(function(d) {
                return Math.max(0, y(d.y + d.dy));
              });

            // Bounding circle underneath the sunburst, to make it easier to detect
            // when the mouse leaves the parent g.
            vis.append("svg:circle")
              .attr("r", radius)
              .style("opacity", 0);

            // Show the breadcrumb root
            var ancestors = nodeService.getAncestors(root);
            $rootScope.$broadcast('updateBreadcrumb', root, ancestors);

            var path = vis.data([root]).selectAll("#sunburst-path")
              .data(partition.nodes(root))
              .enter().append("svg:path")
              .attr("id", "sunburst-path")
              .style("z-index", 1)
              .attr("d", arc)
              .attr("fill-rule", "evenodd")
              .style("fill", function(d) {
                return d.color;
              })
              .style("opacity", function(d) {
                return d === currentRoot ? 0.3 : 1;
              })
              .on("mouseover", mouseover)
              .style("cursor", "pointer")
              .on("click", sunburst_click);

            // Append text for topic words to center
            vis.append("foreignObject")
              .attr("class", "explanation-obj")
              .style("border-radius", "50%")
              .attr("width", radius - wordMargin)
              .attr("height", radius - wordMargin)
              .style("z-index", 100)
              .style("cursor", "pointer")
              .attr("transform", function(d) {
                // some magic numbers to avoid absolute positioning the center text div
                return "translate(" + -radius / 3 + "," + -(radius) / 3 + ")";
              })
              .append("xhtml:div")
              .attr("id", "words")
              .style("text-align", "center")
              .on("click", center_click);

            // Show the list of words for the currently focused node
            showWords(currentRoot);

            // Add the mouseleave handler to the bounding circle.
            d3.select("#container").on("mouseleave", mouseleave);


            function sunburst_click(d) {
              var nNode;
              if (d === currentRoot && d.parent) {
                currentRoot = d.parent;
                nNode = currentRoot;
              } else {
                currentRoot = d;
                nNode = d;
              }
              showWords(nNode);
              var ancestors = nodeService.getAncestors(nNode);
              $rootScope.$broadcast('updateBreadcrumb', nNode, ancestors);

              d3.selectAll("#sunburst-path")
                .style("opacity", function(d) {
                  return ancestors.indexOf(d) !== -1 || d === currentRoot ? 0.15 : 1;
                });

              path.transition()
                .duration(500)
                .attrTween("d", arcTween(nNode));

            }

            function center_click() {
              var nNode;
              if (currentRoot && currentRoot.parent) {
                currentRoot = currentRoot.parent;
                nNode = currentRoot;
              }
              showWords(nNode);

              var ancestors = nodeService.getAncestors(nNode);
              $rootScope.$broadcast('updateBreadcrumb', nNode, ancestors);

              d3.selectAll("#sunburst-path")
                .style("opacity", function(d) {
                  return ancestors.indexOf(d) !== -1 || d === currentRoot ? 0.15 : 1;
                });

              path.transition()
                .duration(500)
                .attrTween("d", arcTween(nNode));
            }


            // Interpolate the scales!
            function arcTween(d) {

              $rootScope.$broadcast('updatePerspective', nodeService.getAncestors(d), nodeService.getChildren(d));

              var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);

              return function(d, i) {
                return i ? function(t) {
                  return arc(d);
                } : function(t) {
                  x.domain(xd(t));
                  y.domain(yd(t)).range(yr(t));
                  return arc(d);
                };
              };
            }

            function showWords(d) {
              d3.select("#words")
                .empty();

              var words = wordFormat.formatWords(d.words, 'sunburst');

              d3.select("#words")
                .html(words);

              d3.select("#words")
                .style("visibility", "");

            }

            // Fade all but the current sequence, and show it in the breadcrumb trail.
            function mouseover(d) {

              showWords(d);

              var sequenceArray = nodeService.getAncestors(d);

              $rootScope.$broadcast('updateBreadcrumb', d, sequenceArray);

              // Fade all the segments.
              d3.selectAll("#sunburst-path")
                .style("opacity", 0.15);

              var ancestors = nodeService.getAncestorsWithoutRoot(d);
              // Then highlight only those that are an ancestor of the current segment.
              vis.selectAll("#sunburst-path")
                .style("opacity", function(d) {
                  return ancestors.indexOf(d) > ancestors.indexOf(currentRoot) ? 1 : 0.15;
                });

            }

            // Restore everything to full opacity when moving off the visualization.
            function mouseleave() {

              // Deactivate all segments during transition.
              d3.selectAll("#sunburst-path").on("mouseover", null);

              var ancestors = nodeService.getAncestors(currentRoot);

              $rootScope.$broadcast('updateBreadcrumb', currentRoot, ancestors);

              // Transition each segment to full opacity and then reactivate it.
              d3.selectAll("#sunburst-path")
                .transition()
                .duration(1000)
                .style("opacity", function(d) {
                  if (!d.children)
                    return 0.4;
                  else
                    return ancestors.indexOf(d) !== -1 ? 0.15 : 1;
                })
                .each("end", function() {
                  d3.select(this).on("mouseover", mouseover);
                });

              showWords(currentRoot);

            }
          }
        }
      };
    }
  ]);