    FROM emscripten/emsdk:latest AS wasm-builder

    WORKDIR /src
    COPY src/bif.c .

    RUN emcc -O3 bif.c -o bif.js \
        -s SINGLE_FILE=1 \
        -s SINGLE_FILE_BINARY_ENCODE=0 \
        -s WASM_ASYNC_COMPILATION=0

    FROM ubuntu:20.04 AS final
    ENV DEBIAN_FRONTEND=noninteractive

    RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential pkg-config git cmake m4 xxd \
        ca-certificates libgtk-3-dev libwebkit2gtk-4.0-dev \
        && rm -rf /var/lib/apt/lists/*

    RUN git clone --depth=1 https://github.com/webview/webview.git /tmp/webview && \
        cd /tmp/webview && cmake -B build -S . && \
        cmake --build build --config Release && \
        cmake --install build && ldconfig && \
        rm -rf /tmp/webview

    COPY --from=wasm-builder /src/bif.js /app/build/bif.js
    COPY . /app/

    WORKDIR /app
    RUN make build/wasik
