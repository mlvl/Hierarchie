#Hierarchie

## Functionality as of 3/25/14
- Hover & zoom on main sunburst to explore
- Context is displayed in smaller perspective sunburst
- Breadcrumb updates accordingly
- Partition view is implemented but not displayed

## Known Issues & Suggested Improvements
- Directives sometimes fail to load and require a refresh
- No tests have been created at this time
- Dependencies are not managed
- Text appends using foreignObject will not work in IE

## Notes
- D3 is being defined in the global namespace for debugging ease. Remove declaration from controller in production.
