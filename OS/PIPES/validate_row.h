#ifndef VALIDATE_ROW_H
#define VALIDATE_ROW_H

#include <stdbool.h>
#include <stdlib.h>
#include <unistd.h>

#define SUDOKU_LEN 9

bool validateRow(const int *sudoku);
bool validateAllRows(const int *sudoku);
int *getSudokuFromString(char st[SUDOKU_LEN * SUDOKU_LEN]);

#endif