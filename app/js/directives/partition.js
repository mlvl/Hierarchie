define(['angular', 'services'], function(angular, services) {
  'use strict';
  
angular.module('recursiviz.directives')
    .directive('partitionChart', ['$rootScope', 'd3Service', 'wordFormat', 'clear', 'nodeService', function($rootScope, d3Service, wordFormat, clear, nodeService) {
        return {
          restrict: 'A',
          scope: {
            data: "="
          },
          link: function(scope, elm, attrs) {
            d3Service.getD3(function(d3) {

              // Watch for data load
              scope.$watch('data', function(newVals, oldVals) {
                if (newVals)
                  return render(newVals);
                else
                  return;
              }, false);

              scope.$on('renderPartition', function(ev) {
                clear.all(d3);
                d3.select('#sunburst_layout').attr("class", "option");
                d3.select('#partition_layout').attr("class", "option selected");
                render(scope.data);
              });

              function render(root) {                
                var margin = 150;
                var textMargin = 3;
                var w = d3.select("#viz_panel")[0][0].clientWidth,
                  h = angular.element(window)[0].innerHeight - margin,
                  x = d3.scale.linear().range([0, w]),
                  y = d3.scale.linear().range([0, h]);

                var vis = d3.select("#partition").append("div")
                  .attr("class", "chart")
                  .style("width", w + "px")
                  .style("height", h + "px")
                  .append("svg:svg")
                  .attr("width", w)
                  .attr("height", h);

                var partition = d3.layout.partition()
                  .sort(null)
                  .value(function(d) {
                    return d.depth;
                  });

                var g = vis.selectAll("g")
                  .data(partition.nodes(root))
                  .enter().append("svg:g")
                  .attr("transform", function(d) {
                    return "translate(" + x(d.y) + "," + y(d.x) + ")";
                  })
                  .style("opacity", 1)
                  .on("click", click)
                  .on("mouseover", function(d){ mouseover(d,this) })
                  .on("mouseout", function(d) { mouseout(d,this) });

                var kx = w / root.dx,
                  ky = h / 1;

                g.append("svg:rect")
                  .attr("width", function(d) {
                    return d.dx * ky > 12 ? root.dy * kx : 15;
                  })
                  .attr("height", function(d) {
                    return d.dx * ky;
                  })
                  .attr("fill", function(d) {
                    return d.children ? d.color : "#aaa";
                  })
                  .attr("class", function(d) {
                    return d.children ? "parent" : "child";
                  });

                //TODO: Handle text appending differently in IE because foreignObject is not supported
                g.append("foreignObject")
                  .attr("class", "foreignObj")
                  .attr("width", root.dy * kx)
                  .attr("height", function(d) {
                    return d.dx * ky;
                  })
                  .append("xhtml:div")
                  .attr("class", "label-div")
                  .style("opacity", function(d) {
                    return d.dx * ky > 12 ? 1 : 0;
                  })
                  .style("font-size", function(d) {
                    return Math.min(30,(d.dx * ky - textMargin)) +"px"; 
                  })
                  .html(function(d) {
                    if (d.depth)
                      return wordFormat.singleWord(d.depth, d.words);
                    else
                      return wordFormat.formatWords(d.words,"partition");
                  });

//                d3.select(window)
//                  .on("click", function() {
//                    click(root);
//                  });

                function click(d) {
                  if (!d.children)
                    return;
                  
                  var sequenceArray = nodeService.getAncestors(d);

                  $rootScope.$broadcast('updateBreadcrumb',d, sequenceArray);
                  
                  var currentDepth = d.depth;

                  kx = (d.y ? w - 40 : w) / (1 - d.y);
                  ky = h / d.dx;
                  x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
                  y.domain([d.x, d.x + d.dx]);

                  var t = g.transition()
                    .duration(d3.event.altKey ? 7500 : 750)
                    .attr("transform", function(d) {
                      return "translate(" + x(d.y) + "," + y(d.x) + ")";
                    });

                  t.select("rect")
                    .attr("width", function(d) {
                      return d.dx * ky > 12 ? root.dy * kx : 15;
                    })
                    .attr("height", function(d) {
                      return d.dx * ky;
                    });

                  d3.selectAll(".foreignObj")
                    .attr("width", d.dy * kx)
                    .attr("height", function(d) {
                      return d.dx * ky;
                    });

                  d3.selectAll(".label-div")
                    .style("opacity", function(d) {
                      return d.dx * ky > 12 ? 1 : 0;
                    })
                    .style("font-size", function(d) {
                      //if (d.depth !== currentDepth)
                        return Math.min(30,(d.dx * ky - textMargin)) + "px";
                    })
                    .html(function(d) {
                      if (d.depth !== currentDepth)
                        return wordFormat.singleWord(d.depth, d.words);
                      else
                        return wordFormat.formatWords(d.words, "partition");
                    });
                  
                  d3.event.stopPropagation();
                }

                function mouseover(d, item) {
                  d3.selectAll("g")
                    .style("opacity", 0.8);
                  
                  d3.select(item)
                    .style("opacity", 1);
                }
                
                function mouseout(d, item) {
                  d3.selectAll("g")
                    .style("opacity", 1);
                }
                
                function transform(d) {
                  return "translate(8," + d.dx * ky / 2 + ")";
                }
              }
            });
          }
        }
      }]);
  });

