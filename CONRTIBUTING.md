If you want to develop, I'm looking to make things stable across distros and to check stuff works I have a Dockerfile that contains the necessary stuff to make the 
emscripten glue code and then I only check that it properly compiles with an older version of libwebkit2gtk. 

The file that does this is **test.sh**, I'm using podman but nothing podman-specific nor am I planning to.
