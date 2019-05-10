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
    int res;
    bool correct;
    int matCount = argc - 1;

    if (pipe(pRes) < 0 || pipe(p1) < 0 || pipe(p2) < 0 || pipe(p3) < 0)
    {
        printf("Error creating pipe!\n");
        exit(1);
    }

    write(p1[1], &matCount, sizeof(int));
    write(p2[1], &matCount, sizeof(int));
    write(p3[1], &matCount, sizeof(int));

    if ((pid1 = fork()) == -1)
    {
        printf("Error creating fork!\n");
        exit(1);
    }
    else if (pid1 == 0)
    {

        close(p1[1]);
        dup2(pRes[1], 1);
        dup2(p1[0], 0);
        execl("./row", "\0");

        exit(1);
    }

    if ((pid2 = fork()) == -1)
    {
        printf("Error creating fork!\n");
        exit(1);
    }
    else if (pid2 == 0)
    {

        close(p2[1]);
        dup2(pRes[1], 1);
        dup2(p2[0], 0);
        execl("./col", "\0");

        exit(1);
    }

    if ((pid3 = fork()) == -1)
    {
        printf("Error creating fork!\n");
        exit(1);
    }
    else if (pid3 == 0)
    {
        close(p3[1]);
        dup2(pRes[1], 1);
        dup2(p3[0], 0);
        execl("./sub-mat", NULL);

        exit(1);
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

        correct = true;
        for (int i = 0; i < 3; i++)
        {
            read(pRes[0], &res, sizeof(int));

            if (res == 0)
            {
                correct = false;
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

    close(p1[0]);
    close(p2[0]);
    close(p3[0]);
    close(pRes[0]);
    close(pRes[1]);

    return 0;
}
