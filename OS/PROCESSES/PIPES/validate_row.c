#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

#define SUDOKU_LEN 9

bool validateRow(const int *sudoku)
{
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        int currNum = *(sudoku + i);
        if (!nums[currNum - 1])
        {
            nums[currNum - 1] = 1;
        }
        else
        {
            return false;
        }
    }
    for (int j = 0; j < SUDOKU_LEN; ++j)
    {
        if (!nums[j])
        {

            return false;
        }
    }
    return true;
}

bool validateAllRows(const int *sudoku)
{
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        if (!validateRow(sudoku + (i * SUDOKU_LEN)))
        {
            return false;
        }
    }

    return true;
}

int *getSudokuFromString(char st[SUDOKU_LEN * SUDOKU_LEN])
{
    int *sudoku = malloc(sizeof(int) * SUDOKU_LEN * SUDOKU_LEN);
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        for (int j = 0; j < SUDOKU_LEN; ++j)
        {
            *(sudoku + (i * SUDOKU_LEN) + j) = st[(i * SUDOKU_LEN) + j] - 48;
        }
    }
    return sudoku;
}

int main(int argc, char *argv[])
{
    // int outputFileDescriptor = atoi(argv[1]);

    char mat[SUDOKU_LEN * SUDOKU_LEN];

    while (read(STDIN_FILENO, mat, sizeof(char) * SUDOKU_LEN * SUDOKU_LEN))
    {
        int res = validateAllRows(getSudokuFromString(mat));
        write(STDOUT_FILENO, &res, sizeof(char));
    }

    return 0;
}