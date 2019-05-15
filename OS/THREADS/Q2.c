#include "Q2.h"

pthread_mutex_t taskLock = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t resLock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t condition = PTHREAD_COND_INITIALIZER; 
pthread_mutex_t conditionWaitMutex = PTHREAD_MUTEX_INITIALIZER;

static int res = 1;
static int ready = 0;

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


void *performRandomTask(void *vargp) {
    Tasks* tasks = (Tasks*) vargp;

    pthread_mutex_lock(&taskLock); 

    int task, row, col;

    for (int i = 0; i < NUMBER_OF_TASKS; i++) {
        if (tasks->tasks[i] > 0) {
            task = tasks->tasks[i];
            tasks->tasks[i] = 0;
            break;
        }
    }

    pthread_mutex_unlock(&taskLock); 

    pthread_mutex_lock(&resLock); 

    switch (task / 9) {
        case 0:
            row = task / 3 * 3;
            col = task % 3 * 3;
            res *= validateSubMatrix(tasks->sudoku, row, col);
            break;
        case 1:
            res *= validateRow(tasks->sudoku, task % 9);
            break;
        case 2:
            res *= validateCol(tasks->sudoku, task % 9);
            break;
    }

    pthread_mutex_unlock(&resLock); 
    
    if (task == NUMBER_OF_TASKS - 1) {
        pthread_mutex_lock(&conditionWaitMutex);
        ready = 1;
        pthread_cond_signal(&condition); 
        pthread_mutex_unlock(&conditionWaitMutex);
    }

    return NULL;
}

   
int main(int argc, char* argv[]) {
    Sudoku sudoku = readSudokuFile(argv[1]);
    if (!sudoku.status) {
        sudoku = getSudokuFromInput();
    }

    pthread_t threads[NUM_THREADS];

    Tasks tasks;
    tasks.sudoku = sudoku;

    for(int i = 0; i < NUMBER_OF_TASKS; i++)
    {
        tasks.tasks[i] = i;
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_create(&threads[i], NULL, performRandomTask, (void*) &tasks);
    }

    pthread_cond_init(&condition, NULL);
    pthread_mutex_lock(&conditionWaitMutex);
    while (ready == 0) {
        pthread_cond_wait(&condition, &conditionWaitMutex);
    }
    pthread_mutex_unlock(&conditionWaitMutex);

    for(int i = 0; i < NUM_THREADS; i++)
    {
        pthread_join(threads[i], NULL);
    }

    if (!res) {
        printf("solution is not legal!\n");
        return 0;
    }

    printf("solution is legal\n");
    return 0;
}
