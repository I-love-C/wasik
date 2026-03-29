#include <stddef.h>
#define USING_UTILS
#include "utils.h"
#include "wasik.h"

WASIK_BENCHMARK(fib_v1) {
    return value < 2 ? value : fib_v1(value - 1) + fib_v1(value - 2);
}

WASIK_BENCHMARK(fib_v2) {
    size_t a = 1, b = 1;
    for (size_t i = 3; i < value + 1; i++) {
        b += a;
        a = b - a;
    }
    return b;
}

WASIK_BENCHMARK(fib_v3) {
    if (value == 0) return 0;
    if (value <= 2) return 1;

    Matrix2 base = {{1, 1, 1, 0}};
    Matrix2 result = matrix2_pow(base, value - 1);

    return *result.data;
}
