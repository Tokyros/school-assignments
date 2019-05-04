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
#define NUMBER_OF_TASKS  27
#define FILE_NAME "sudoku.txt"

typedef struct {
    int matrix[SUDOKU_LEN][SUDOKU_LEN];
    bool status;
} Sudoku;

typedef struct {
    Sudoku sudoku;
    int tasks[27];
} Tasks;

pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t condition = PTHREAD_COND_INITIALIZER; 

static int res = 1;

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


void *performRandomTask(void *vargp) {
    Tasks* tasks = (Tasks*) vargp;

    pthread_mutex_lock(&lock); 

    int task, row, col;

    for (int i = 0; i < NUMBER_OF_TASKS; i++) {
        if (tasks->tasks[i] > 0) {
            task = tasks->tasks[i];
            tasks->tasks[i] = 0;
            break;
        }
    }

    pthread_mutex_unlock(&lock); 

    switch (task / 9) {
        case 0:
            res *= validateRow(tasks->sudoku, task % 9);
            break;
        case 1:
            res *= validateCol(tasks->sudoku, task % 9);
            break;
        case 2:
            row = task / 3 * 3;
            col = task % 3 * 3;
            res *= validateSubMatrix(tasks->sudoku, row, col);
            break;
    }
    printf("%d\n", task);
    if (task == NUMBER_OF_TASKS - 1) {
        pthread_cond_signal(&condition); 
    }

    return NULL;
}

   
int main() {
    Sudoku sudoku = readSudokuFile();
    if (!sudoku.status) {
        sudoku = getSudokuFromInput();
    }

    pthread_t threads[NUM_THREADS];

    Tasks tasks;
    for(int i = 0; i < NUMBER_OF_TASKS; i++)
    {
        tasks.tasks[i] = i;
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        tasks.sudoku = sudoku;
        pthread_create(&threads[i], NULL, performRandomTask, (void*) &tasks);
    }

    printf("we're waiting, so...\n");
    pthread_cond_wait(&condition, &lock); 

    for(int i = 0; i < NUM_THREADS; i++)
    {
        pthread_join(threads[i], NULL);
    }

    if (!res) {
        printf("The sudoku was invalid!\n");
        return 0;
    }

    printf("The sudoku was valid\n");
    return 0;
}
