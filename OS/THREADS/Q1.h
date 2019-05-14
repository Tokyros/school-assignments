#ifndef Q1_H
#define Q1_H

#include <stdlib.h> 
#include <pthread.h> 
#include <stdio.h>
#include <stdbool.h>

#define NUM_THREADS 27
#define SUDOKU_LEN  9

enum TASKS { ROW, COL, SUB };
typedef struct {
    int matrix[SUDOKU_LEN][SUDOKU_LEN];
    bool status;
} Sudoku;

typedef struct {
    int indexToCheck;
    enum TASKS taskType;
} ChekingArgs;

bool validateRow(Sudoku sudoku, int row);
bool validateCol(Sudoku sudoku, int col);
bool validateSubMatrix(Sudoku sudoku, int row, int col);
Sudoku readSudokuFile(char* fileName);
Sudoku getSudokuFromInput();
void *threadFunction(void *vargp);

#endif