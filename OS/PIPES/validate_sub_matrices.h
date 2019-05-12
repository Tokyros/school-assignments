#ifndef VALIDATE_SUB_MATRICES_H
#define VALIDATE_SUB_MATRICES_H

#include <stdbool.h>
#include <stdlib.h>
#include <unistd.h>

#define SUDOKU_LEN 9

bool validateSubMatrix(const int *sudoku);
bool validateAllSubMatrices(const int *sudoku);
int *getSudokuFromString(char st[SUDOKU_LEN * SUDOKU_LEN]);

#endif