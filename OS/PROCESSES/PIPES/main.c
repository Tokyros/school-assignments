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

    int pRes[2], p1[2], p2[2], p3[2], pid1, pid2, pid3;

    if (pipe(pRes) < 0)
    {
        printf("Error creating pipe!\n");
        exit(1);
    }

    if (pipe(p1) < 0)
    {
        printf("Error creating pipe!\n");
        exit(1);
    }

    if (pipe(p2) < 0)
    {
        printf("Error creating pipe!\n");
        exit(1);
    }

    if (pipe(p3) < 0)
    {
        printf("Error creating pipe!\n");
        exit(1);
    }

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

        dup2(pRes[1], 1);
        dup2(p1[0], 0);
        char *argv[] = {NULL};
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

        char *argv[] = {NULL};
        char *envp[] = {NULL};
        dup2(pRes[1], 1);
        dup2(p2[0], 0);
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
        char *argv[] = {NULL};
        char *envp[] = {NULL};
        dup2(pRes[1], 1);
        dup2(p3[0], 0);
        execve("./sub-mat", argv, envp);

        exit(0);
    }

    for (int i = 1; i < argc; i++)
    {

        char *fileName = argv[i];

        Sudoku sudoku = readSudokuFile(fileName);
        if (!sudoku.status)
        {
            sudoku = getSudokuFromInput();
        }

        char *stringMat = convertMatToString(sudoku.matrix);

        write(p1[1], stringMat, sizeof(char) * SUDOKU_LEN * SUDOKU_LEN);
        write(p2[1], stringMat, sizeof(char) * SUDOKU_LEN * SUDOKU_LEN);
        write(p3[1], stringMat, sizeof(char) * SUDOKU_LEN * SUDOKU_LEN);

        free(stringMat);

        char res;
        bool correct = true;
        for (int i = 0; i < 3; i++)
        {
            read(pRes[0], &res, sizeof(char));

            if (res == '0')
            {
                correct = false;
                break;
            }
        }
        if (correct)
        {
            printf("Sudoku in file %s is legal!\n", fileName);
        }
        else
        {
            printf("Sudoku in file %s is illegal!\n", fileName);
        }
    }

    return 0;
}
