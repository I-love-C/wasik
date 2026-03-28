#include <stddef.h>
#include <emscripten.h>

volatile size_t wrench = 0;

EMSCRIPTEN_KEEPALIVE
size_t fib_v1(size_t value) {
    return value < 2 ? value : fib_v1(value - 1) + fib_v1(value - 2);
}

EMSCRIPTEN_KEEPALIVE
size_t fib_v2(size_t value) {
    size_t a = 1, b = 1;
    for (size_t i = 3; i < value + 1; i++) {
        b += a;
        a = b - a;
    }
    return b;
}


EMSCRIPTEN_KEEPALIVE
double benchmark_fib_v2(size_t value, size_t batch_size) {
    size_t sum_sum = 0;
    double start = emscripten_get_now();
    for (size_t i = 0; i < batch_size; i++)
        sum_sum += fib_v2(value);
    double end = emscripten_get_now();
    wrench = sum_sum;
    return (end - start) / (double)batch_size;
}
