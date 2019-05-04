#include <stdio.h> 
#include <stdlib.h> 
#include <unistd.h>
#include <pthread.h> 

#include <stdio.h>
#include <zconf.h>
#include <stdbool.h>
#include <sys/mman.h>
#include <sys/wait.h>

#define NUM_THREADS 27
#define SUDOKU_LEN  9
#define FILE_NAME "sudoku.txt"

typedef struct {
    int matrix[SUDOKU_LEN][SUDOKU_LEN];
    bool status;
} Sudoku;

typedef struct {
    Sudoku sudoku;
    int indexToCheck;
    int* res;
} ChekingArgs;

bool validateRow(Sudoku sudoku, int row) {
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 0; i < SUDOKU_LEN; ++i) {
        int currNum = sudoku.matrix[row][i];
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

bool validateCol(Sudoku sudoku, int col) {
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 0; i < SUDOKU_LEN; ++i) {
        int currNum = sudoku.matrix[i][col];
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


bool validateSubMatrix(Sudoku sudoku, int row, int col) {
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = row; i < row + 3; ++i) {
        for (int j = col; j < col + 3; ++j) {
            int currNum = sudoku.matrix[i][j];
            if (!nums[currNum - 1]) {
                nums[currNum - 1] = 1;
            } else {
                return false;
            }
        }

    }
    for (int j = 0; j < SUDOKU_LEN; ++j) {
        if (!nums[j]) {
            return false;
        }
    }
    return true;
}

Sudoku readSudokuFile() {
    int i, j, currentNum;
    Sudoku board;
    FILE* file = fopen(FILE_NAME, "r");

    if (!file) {
        printf("Invalid filename!\n");
        board.status = false;
        return board;
    }

    for (i = 0; i < SUDOKU_LEN; ++i) {
        for (j = 0; j < SUDOKU_LEN; ++j) {
            if (fscanf(file, "%d", &currentNum)) {
                board.matrix[i][j] = currentNum;
            }
        }
    }
    board.status = true;
    return board;
}

Sudoku getSudokuFromInput() {
    int i, j;
    Sudoku board;
    printf("Please enter the numbers that construct your Sudoku board:");
    for (i = 0; i < SUDOKU_LEN; ++i) {
        for (j = 0; j < SUDOKU_LEN; ++j) {
            scanf("%d", &board.matrix[i][j]);
        }
    }
    board.status = false;
    return board;
}

void *rowsCheckingThread(void *vargp) {
    ChekingArgs* rca = (ChekingArgs*) vargp;
    bool res = validateRow(rca->sudoku, rca->indexToCheck);
    rca->res[rca->indexToCheck] = res;
    return NULL;
}

void *colsCheckingThread(void *vargp) {
    ChekingArgs* rca = (ChekingArgs*) vargp;
    bool res = validateCol(rca->sudoku, rca->indexToCheck);
    rca->res[9 + rca->indexToCheck] = res;
    return NULL;
}

void *subMatricesCheckingThread(void *vargp) {
    ChekingArgs* rca = (ChekingArgs*) vargp;
    int row = rca->indexToCheck / 3 * 3;
    int col = rca->indexToCheck % 3 * 3;
    bool res = validateSubMatrix(rca->sudoku, row, col);
    rca->res[18 + rca->indexToCheck] = res;
    return NULL;
}

   
int main() {
    Sudoku sudoku = readSudokuFile();
    if (!sudoku.status) {
        sudoku = getSudokuFromInput();
    }

    pthread_t threads[NUM_THREADS];
    int res[NUM_THREADS];
    ChekingArgs* args[27];

    for (int i = 0; i < NUM_THREADS / 3; i++) {
        ChekingArgs* checkingArgs = malloc(sizeof(ChekingArgs));
        checkingArgs->sudoku = sudoku;
        checkingArgs->indexToCheck = i;
        checkingArgs->res = res;
        args[i] = checkingArgs;
        pthread_create(&threads[i], NULL, rowsCheckingThread, (void*) checkingArgs);
    }

    for (int i = 0; i < NUM_THREADS / 3; i++) {
        ChekingArgs* checkingArgs = malloc(sizeof(ChekingArgs));
        checkingArgs->sudoku = sudoku;
        checkingArgs->indexToCheck = i;
        checkingArgs->res = res;
        args[i] = checkingArgs;
        pthread_create(&threads[i], NULL, colsCheckingThread, (void*) checkingArgs);
    }

    for (int i = 0; i < NUM_THREADS / 3; i++) {
        ChekingArgs* checkingArgs = malloc(sizeof(ChekingArgs));
        checkingArgs->sudoku = sudoku;
        checkingArgs->indexToCheck = i;
        checkingArgs->res = res;
        args[i] = checkingArgs;
        pthread_create(&threads[i], NULL, subMatricesCheckingThread, (void*) checkingArgs);
    }

    for(int i = 0; i < NUM_THREADS; i++)
    {
        pthread_join(threads[i], NULL);
        free(args[i]);
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        if (!res[i]) {
            printf("The sudoku was invalid!\n");
            return 0;
        }
    }

    printf("The sudoku was valid\n");
    return 0;
}
