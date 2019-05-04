#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

#define SUDOKU_LEN  9

bool validateCol(const int* sudoku) {
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 0; i < SUDOKU_LEN; ++i) {
        int currNum = *(sudoku + (i * SUDOKU_LEN));
        if (!nums[currNum - 1]) {
            nums[currNum - 1] = 1;
        } else {
            return false;
        }
    }
    for (int j = 0; j < SUDOKU_LEN; ++j) {
        if (!nums[j]) {
            return false;
        }
    }
    return true;
}

bool validateAllCols(const int* sudoku) {
    for (int i = 0; i < SUDOKU_LEN; ++i) {
        if (!validateCol(sudoku + i)) {
            return false;
        }
    }

    return true;
}

int* getSudokuFromString(char st[SUDOKU_LEN * SUDOKU_LEN]) {
    int* sudoku = malloc(sizeof(int) * SUDOKU_LEN * SUDOKU_LEN);
    for (int i = 0; i < SUDOKU_LEN; ++i) {
        for (int j = 0; j < SUDOKU_LEN; ++j) {
            *(sudoku + (i * SUDOKU_LEN) + j) = st[(i * SUDOKU_LEN) + j] - 48;
        }
    }
    return sudoku;
}

int main(int argc, char* argv[]) {
    int outputFileDescriptor = atoi(argv[1]);

    int res = validateAllCols(getSudokuFromString(argv[0]));

    char* st = malloc(sizeof(char) * 2);
    sprintf(st, "%d", res);
    write(outputFileDescriptor, st, sizeof(char));
    free(st);

    return 0;
}