#ifndef Q2_H
#define Q2_H

#include <stdio.h> 
#include <pthread.h> 
#include <stdbool.h>

#define SUDOKU_LEN 9
#define NUM_THREADS 27
#define NUMBER_OF_TASKS 27

typedef struct {
    int matrix[SUDOKU_LEN][SUDOKU_LEN];
    bool status;
} Sudoku;

typedef struct {
    Sudoku sudoku;
    int tasks[27];
} Tasks;

bool validateRow(Sudoku sudoku, int row);

bool validateCol(Sudoku sudoku, int col);
bool validateSubMatrix(Sudoku sudoku, int row, int col);
Sudoku readSudokuFile(char* fileName);
Sudoku getSudokuFromInput();

#endif