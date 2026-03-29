#include <stddef.h>
#include <emscripten.h>

// CHART

#define MAX_BUFFER 10000
double chart_array[MAX_BUFFER]; // hardcoded max for c_shared_chart_array size

EMSCRIPTEN_KEEPALIVE
double* get_buffer_ptr() {
    return chart_array;
}

// BENCHMARKING

#define WASIK_PREFIX  WASIK
#define MAX_MS 10.0

#define BENCHMARK_FUNC(func_name)                                                       \
EMSCRIPTEN_KEEPALIVE                                                                    \
int WASIK##_benchmark_chunk_##func_name(int start_val, int max_val, int batch_size) {   \
    double chunk_start_time = emscripten_get_now();                                     \
    int current_val = start_val;                                                        \
    volatile size_t wrench = 0;                                                         \
    while (current_val <= max_val) {                                                    \
        double start_time = emscripten_get_now();                                       \
        for (int i = 0; i < batch_size; i++) wrench += func_name(current_val);          \
        double end_time = emscripten_get_now();                                         \
        chart_array[current_val - 1] = (end_time - start_time) / batch_size;            \
        current_val++;                                                                  \
        if (emscripten_get_now() - chunk_start_time >= MAX_MS) break;                   \
    }                                                                                   \
    return current_val - start_val;                                                     \
}

size_t fib_v1(size_t value);
BENCHMARK_FUNC(fib_v1)

size_t fib_v1(size_t value) {
    return value < 2 ? value : fib_v1(value - 1) + fib_v1(value - 2);
}

size_t fib_v2(size_t value);
BENCHMARK_FUNC(fib_v2)

size_t fib_v2(size_t value) {
    size_t a = 1, b = 1;
    for (size_t i = 3; i < value + 1; i++) {
        b += a;
        a = b - a;
    }
    return b;
}
