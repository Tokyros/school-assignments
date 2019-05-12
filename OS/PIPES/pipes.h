#ifndef MAIN_H
#define MAIN_H

#include <stdio.h>
#include <zconf.h>
#include <stdbool.h>
#include <stdlib.h>

#define SUDOKU_LEN 9

typedef struct
{
    int matrix[SUDOKU_LEN][SUDOKU_LEN];
    bool status;
} Sudoku;

Sudoku readSudokuFile(char *fileName);
Sudoku getSudokuFromInput();
char *convertMatToString(int mat[SUDOKU_LEN][SUDOKU_LEN]);

#endif