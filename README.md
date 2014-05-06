#Hierarchie

Hierarchie allows the visualization of topic distributions. It was created by [Decisive Analytics Corporation](http://www.dac.us/) to display the result of running Hierarchical Latent Dirichlet Allocation (LDA) on a corpus of documents. In this case, the corpus consists of 1600 Tweets and 970 Reddit comments containing the keyword ``MH370'' in addition to 27 Daily Beast articles returned by a URL filter for any of the key words ``malay,'' ``370'', ``flight,'' ``missing,'' ``hijack,'' ``radar,'' ``pilot,'' ``plane,'' ``airplane,'' and ``wreckage.'' These documents were collected during the first week of MH-370's disappearance.

By exploring the visualization, it's possible to discern different topics and theories relating to the airliner. 

This implementation of a sunburst was based upon [Sequences Sunburst](http://bl.ocks.org/kerryrodden/7090426) by Kerry Rodden and [Zoomable Sunburst](http://bl.ocks.org/mbostock/4348373) by Mike Bostock.


## License

Hierarchie is covered by the Apache Version 2.0 License. Please see LICENSE.txt for more details.

## Known Issues & Suggested Improvements
- Needs tests!
- Better positioning of center text
- Center text appends using foreignObject will not work in IE