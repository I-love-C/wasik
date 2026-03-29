This is a lightweight profiling visualizer built with webview and charts.js to help track function "performance", in this case only execution time. 

To use it a pseudo-terminal is provided, **ctrl+h** shows the help.

To register a function look in **src/bif.c** and use the **REGISTER_BENCHMARK_FUNC** macro for it to be properly registered to wasm.
