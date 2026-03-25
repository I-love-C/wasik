#include <stddef.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
size_t fib_simple(size_t value) {
    return value < 2 ? value : fib_simple(value - 1) + fib_simple(value - 2);
}
