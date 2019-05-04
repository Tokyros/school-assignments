#include <stdio.h>
#include <zconf.h>
#include <stdbool.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/wait.h>
#include <errno.h>
#include <string.h>

#define SUDOKU_LEN 9

typedef struct
{
    int matrix[SUDOKU_LEN][SUDOKU_LEN];
    bool status;
} Sudoku;


Sudoku readSudokuFile(char *fileName)
{
    int i, j, currentNum;
    Sudoku board;
    FILE *file = fopen(fileName, "r");

    if (!file)
    {
        printf("Invalid filename!\n");
        board.status = false;
        return board;
    }

    for (i = 0; i < SUDOKU_LEN; ++i)
    {
        for (j = 0; j < SUDOKU_LEN; ++j)
        {
            if (fscanf(file, "%d", &currentNum))
            {
                board.matrix[i][j] = currentNum;
            }
        }
    }
    board.status = true;
    return board;
}

Sudoku getSudokuFromInput()
{
    int i, j;
    Sudoku board;
    printf("Please enter the numbers that construct your Sudoku board:");
    for (i = 0; i < SUDOKU_LEN; ++i)
    {
        for (j = 0; j < SUDOKU_LEN; ++j)
        {
            scanf("%d", &board.matrix[i][j]);
        }
    }
    board.status = false;
    return board;
}

char *convertMatToString(int mat[SUDOKU_LEN][SUDOKU_LEN])
{
    char *stMat = malloc((sizeof(char) * SUDOKU_LEN * SUDOKU_LEN) + 1);
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        for (int j = 0; j < SUDOKU_LEN; ++j)
        {
            sprintf(&stMat[(SUDOKU_LEN * i) + j], "%d", mat[i][j]);
        }
    }
    return stMat;
}

int main(int argc, char *argv[])
{

    for (int i = 1; i < argc; i++)
    {

        char *fileName = argv[i];

        Sudoku sudoku = readSudokuFile(fileName);
        if (!sudoku.status)
        {
            sudoku = getSudokuFromInput();
        }

        char *stringMat = convertMatToString(sudoku.matrix);

        int p1[2], pid1, pid2, pid3;

        if (pipe(p1) < 0)
        {
            printf("Error creating pipe!\n");
            exit(1);
        }

        char *writeChannel = malloc(sizeof(char) * 2);
        sprintf(writeChannel, "%d\n", p1[1]);

        if ((pid1 = fork()) > 0)
        {
        }
        else if (pid1 == -1)
        {
            printf("Error creating fork!\n");
            exit(1);
        }
        else
        {

            char *argv[] = {stringMat, writeChannel, NULL};
            char *envp[] = {NULL};
            execve("./row", argv, envp);

            exit(0);
        }

        if ((pid2 = fork()) > 0)
        {
        }
        else if (pid2 == -1)
        {
            printf("Error creating fork!\n");
            exit(1);
        }
        else
        {

            char *argv[] = {stringMat, writeChannel, NULL};
            char *envp[] = {NULL};
            execve("./col", argv, envp);

            exit(0);
        }

        if ((pid3 = fork()) > 0)
        {
        }
        else if (pid3 == -1)
        {
            printf("Error creating fork!\n");
            exit(1);
        }
        else
        {
            char *argv[] = {stringMat, writeChannel, NULL};
            char *envp[] = {NULL};
            execve("./sub-mat", argv, envp);

            exit(0);
        }

        wait(NULL);
        wait(NULL);
        wait(NULL);

        free(stringMat);

        char res[4] = {0, 0, 0, 0};
        read(p1[0], res, sizeof(char) * 3);

        if (strcmp(res, "111") == 0)
        {
            printf("%s is legal!\n", fileName);
        }
        else
        {
            printf("%s is illegal!\n", fileName);
        }
    }

    return 0;
}
