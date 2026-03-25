SHELL := /bin/bash
ASSETS := assets/
SRC := src/

all: wasik

$(ASSETS)bif.js $(ASSETS)bif.wasm: $(SRC)bif.c
	emcc $(SRC)bif.c -o $(ASSETS)bif.js

$(ASSETS)bundle.html: $(ASSETS)bif.js $(ASSETS)bif.wasm $(ASSETS)main.js $(ASSETS)style.css $(ASSETS)chart.min.js $(ASSETS)build.js
	node $(ASSETS)build.js

$(SRC)bundle.h: $(ASSETS)bundle.html
	echo 'const char* html = R"WASIK_BUNDLE(' > $(SRC)bundle.h
	cat $(ASSETS)bundle.html >> $(SRC)bundle.h
	echo ')WASIK_BUNDLE";' >> $(SRC)bundle.h

wasik: $(SRC)main.c $(SRC)bundle.h
	c++ $(SRC)main.c -DWEBVIEW_GTK -O2 -std=c++11 `pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.1` -lwebview -o wasik

clean:
	rm -f $(ASSETS)bif.js $(ASSETS)bif.wasm $(ASSETS)bundle.html $(SRC)bundle.h $(ASSETS)wasik

.PHONY: all clean
