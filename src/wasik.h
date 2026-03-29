#ifndef _WASIK_H_
#define _WASIK_H_

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

#define REGISTER_BENCHMARK_FUNC(func_name)                                                       \
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

// has only one argument, returns only one value
// argument is "size_t value;"
#define WASIK_BENCHMARK(func_name)                  \
    size_t func_name(size_t value);                 \
    REGISTER_BENCHMARK_FUNC(func_name)              \
    size_t func_name(size_t value)


#endif // _WASIK_H_
