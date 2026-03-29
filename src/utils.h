#ifndef _UTILS_H_
#define _UTILS_H_

#include <stddef.h>

typedef struct { size_t data[4]; } Matrix2;
Matrix2 matrix2_mul(Matrix2 m1, Matrix2 m2);
Matrix2 matrix2_pow(Matrix2 matrix, size_t n);

#ifdef USING_UTILS

Matrix2 matrix2_mul(Matrix2 m1, Matrix2 m2) {
    Matrix2 result;
    for (int i = 0; i < 2; i++) {
        int row = i * 2;
        result.data[row]     = m1.data[row] * m2.data[0] + m1.data[row + 1] * m2.data[2];
        result.data[row + 1] = m1.data[row] * m2.data[1] + m1.data[row + 1] * m2.data[3];
    }
    return result;
}

Matrix2 matrix2_pow(Matrix2 matrix, size_t n) {
    if (n == 1) return matrix;

    Matrix2 half = matrix2_pow(matrix, n / 2);
    Matrix2 half_squared = matrix2_mul(half, half);

    return (n % 2 == 0) ? half_squared : matrix2_mul(matrix, half_squared);
}

#endif // USING_UTILS
#endif // _UTILS_H_
