SHELL := /bin/bash
ASSETS := assets/
BUILD := build/
SRC := src/
EMSCRIPTEN_PATH := $(HOME)/emsdk/upstream/emscripten/

all: $(BUILD)wasik

$(BUILD)bif.js: $(SRC)bif.c
	$(EMSCRIPTEN_PATH)emcc $(SRC)bif.c -o $(BUILD)bif.js \
	-s SINGLE_FILE=1 \
	-s SINGLE_FILE_BINARY_ENCODE=0 \
	-s WASM_ASYNC_COMPILATION=0

$(BUILD)bundle.html:$(ASSETS)template.m4 $(BUILD)bif.js $(ASSETS)commands.js $(ASSETS)style.css $(ASSETS)chart.min.js
	cd $(ASSETS) && m4 template.m4 > ../$(BUILD)bundle.html

$(SRC)bundle.h: $(BUILD)bundle.html
	xxd -i $(BUILD)bundle.html > $(SRC)bundle.h

$(BUILD)wasik: $(SRC)main.c $(SRC)bundle.h
	c++ $(SRC)main.c -DWEBVIEW_GTK -O3 -std=c++11 `pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.1` -lwebview -o $(BUILD)wasik

clean:
	rm -f $(BUILD)bif.js $(BUILD)bundle.html $(SRC)bundle.h $(BUILD)wasik

.PHONY: all clean
