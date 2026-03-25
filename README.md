This is a lightweight profiling visualizer built with webview and charts.js to help track function "performance", in this case only execution time. 
You interact with it directly from the DevTools console—just right-click and hit inspect. 
From there, you can run `benchmark(<number of iterations>, Module._<function defined in bif.c>)` to plot your execution data, and simply type `clear()` whenever you want to wipe the graph and start fresh.
