#include "Q1.h"

Sudoku sudoku;
int res[27];

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

Sudoku readSudokuFile(char* fileName) {
    int i, j, currentNum;
    Sudoku board;
    FILE* file = fopen(fileName, "r");

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

void *threadFunction(void *vargp) {
    ChekingArgs* rca = (ChekingArgs*) vargp;
    
    switch (rca->taskType)
    {
    case ROW:
        res[rca->indexToCheck] = validateRow(sudoku, rca->indexToCheck);
        break;
    
    case COL:
         res[9 + rca->indexToCheck] = validateCol(sudoku, rca->indexToCheck);
        break;
    
    case SUB:
        res[18 + rca->indexToCheck] = validateSubMatrix(sudoku, rca->indexToCheck / 3 * 3, rca->indexToCheck % 3 * 3);
        break;
    
    default:
        break;
    }
    
    
    return NULL;
}

   
int main(int argc, char* argv[]) {
    sudoku = readSudokuFile(argv[1]);
    if (!sudoku.status) {
        sudoku = getSudokuFromInput();
    }

    pthread_t threads[NUM_THREADS];
    ChekingArgs* args[NUM_THREADS];

    for (int i = 0; i < NUM_THREADS; i++) {
        ChekingArgs* checkingArgs = malloc(sizeof(ChekingArgs));
        checkingArgs->indexToCheck = i % 9;
        checkingArgs->taskType = i / 9 == 0 ? ROW : i / 9 == 1 ? COL : SUB;
        args[i] = checkingArgs;
        pthread_create(&threads[i], NULL, threadFunction, (void*) checkingArgs);
    }

    for(int i = 0; i < NUM_THREADS; i++)
    {
        pthread_join(threads[i], NULL);
        free(args[i]);
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        if (!res[i]) {
            printf("solution is not legal\n");
            return 0;
        }
    }

    printf("solution is legal\n");
    return 0;
}
