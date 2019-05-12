#ifndef MAIN_H
#define MAIN_H

#include <stdio.h>
#include <zconf.h>
#include <stdbool.h>
#include <sys/mman.h>

#define SUDOKU_LEN 9

typedef struct
{
    int matrix[SUDOKU_LEN][SUDOKU_LEN];
    bool status;
} Sudoku;

typedef struct
{
    bool valid;
    bool handled[3];
    bool waiting[3];
    bool ready;
    bool done;
    Sudoku sudoku;
} Shared;

bool validateRow(Sudoku sudoku, int row);
bool validateAllRows(Sudoku sudoku);
bool validateCol(Sudoku sudoku, int col);
bool validateAllCols(Sudoku sudoku);
bool validateSubMatrix(Sudoku sudoku, int row, int col);
bool validateAllSubMatices(Sudoku sudoku);
Sudoku readSudokuFile(char *fileName);
Sudoku getSudokuFromInput();

#endif