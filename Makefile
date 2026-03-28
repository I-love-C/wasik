SHELL := /bin/bash
ASSETS := assets/
SRC := src/
EMSCRIPTEN_PATH := $(HOME)/emsdk/upstream/emscripten/

all: wasik

$(ASSETS)bif.js: $(SRC)bif.c
	$(EMSCRIPTEN_PATH)emcc $(SRC)bif.c -o $(ASSETS)bif.js \
	-s SINGLE_FILE=1 \
	-s SINGLE_FILE_BINARY_ENCODE=0 \
	-s WASM_ASYNC_COMPILATION=0

$(ASSETS)bundle.html: $(ASSETS)bif.js $(ASSETS)main.js $(ASSETS)style.css $(ASSETS)chart.min.js $(ASSETS)build.js
	node $(ASSETS)build.js

$(SRC)bundle.h: $(ASSETS)bundle.html
	xxd -i $(ASSETS)bundle.html > $(SRC)bundle.h

wasik: $(SRC)main.c $(SRC)bundle.h
	c++ $(SRC)main.c -DWEBVIEW_GTK -O3 -std=c++11 `pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.1` -lwebview -o wasik

clean:
	rm -f $(ASSETS)bif.js $(ASSETS)bundle.html $(SRC)bundle.h $(ASSETS)wasik

.PHONY: all clean
