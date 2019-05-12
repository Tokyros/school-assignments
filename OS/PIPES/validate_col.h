#ifndef VALIDATE_COL_H
#define VALIDATE_COL_H

#include <stdbool.h>
#include <stdlib.h>
#include <unistd.h>

#define SUDOKU_LEN 9

bool validateCol(const int *sudoku);
bool validateAllCols(const int *sudoku);
int *getSudokuFromString(char st[SUDOKU_LEN * SUDOKU_LEN]);

#endif