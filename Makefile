SHELL := /bin/bash
ASSETS := assets/
BUILD := build/
SRC := src/
EMSCRIPTEN_PATH := $(HOME)/emsdk/upstream/emscripten/

all: $(BUILD)wasik

$(BUILD)bif.o: $(SRC)bif.c
	$(EMSCRIPTEN_PATH)emcc -O3 -c $(SRC)bif.c -o $(BUILD)bif.o

$(BUILD)bif.js: $(BUILD)bif.o
	$(EMSCRIPTEN_PATH)emcc -O3 $(BUILD)bif.o -o $(BUILD)bif.js \
	-s SINGLE_FILE=1 \
	-s SINGLE_FILE_BINARY_ENCODE=0 \
	-s WASM_ASYNC_COMPILATION=0

$(ASSETS)app.js: $(ASSETS)benchmark.ts $(ASSETS)terminal.ts $(ASSETS)main.ts
	tsc --target ES2020 --outFile $(ASSETS)app.js $(ASSETS)benchmark.ts $(ASSETS)registry.ts $(ASSETS)terminal.ts $(ASSETS)main.ts

$(BUILD)bundle.html:$(ASSETS)template.m4 $(BUILD)bif.js $(ASSETS)app.js $(ASSETS)style.css $(ASSETS)chart.min.js
	cd $(ASSETS) && m4 template.m4 > ../$(BUILD)bundle.html

$(BUILD)bundle.c: $(BUILD)bundle.html
	xxd -i $(BUILD)bundle.html > $(BUILD)bundle.c

$(BUILD)bundle.o: $(BUILD)bundle.c
	c++ -O3 -c $(BUILD)bundle.c -o $(BUILD)bundle.o

$(BUILD)main.o: $(SRC)main.c
	c++ -c $(SRC)main.c -DWEBVIEW_GTK -O3 -std=c++11 `pkg-config --cflags gtk+-3.0 webkit2gtk-4.1` -o $(BUILD)main.o

$(BUILD)wasik: $(BUILD)main.o $(BUILD)bundle.o
	c++ $(BUILD)main.o $(BUILD)bundle.o `pkg-config --libs gtk+-3.0 webkit2gtk-4.1` -lwebview -o $(BUILD)wasik

clean:
	rm -f $(BUILD)bif.js $(BUILD)bundle.html $(SRC)bundle.h $(BUILD)wasik

.PHONY: all clean
