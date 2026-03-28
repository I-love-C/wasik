#include <stddef.h>
#include <emscripten.h>

#define MAX_BUFFER 10000
double chart_array[MAX_BUFFER];

EMSCRIPTEN_KEEPALIVE
void reset_buffer(int size) {
    for(int i = 0; i < size; i++)
        chart_array[i] = 0.0;
}

EMSCRIPTEN_KEEPALIVE
double* get_buffer_ptr() {
    return chart_array;
}


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
    double start = emscripten_get_now();
    volatile double wrench = 0;
    for (size_t i = 0; i < batch_size; i++) wrench += fib_v2(value);
    double end = emscripten_get_now();
    return end - start;
}


EMSCRIPTEN_KEEPALIVE
int compute_chunk_fib_v2(int start_val, int max_val, int batch_size) {
    double chunk_start_time = emscripten_get_now();
    int current_val = start_val;
    volatile size_t wrench = 0;

    while (current_val <= max_val) {
        double start_time = emscripten_get_now();
        for (int i = 0; i < batch_size; i++) wrench += fib_v2(current_val);
        double end_time = emscripten_get_now();

        chart_array[current_val - 1] = (end_time - start_time) / batch_size;
        current_val++;
        if (emscripten_get_now() - chunk_start_time >= 10.0) break;
    }
    return current_val - start_val;
}
