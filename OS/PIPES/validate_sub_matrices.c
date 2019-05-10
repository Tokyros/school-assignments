#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

#define SUDOKU_LEN 9

bool validateSubMatrix(const int *sudoku)
{
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int j = 0; j < 3; ++j)
    {
        for (int i = 0; i < 3; ++i)
        {
            int currNum = *(sudoku + (j * SUDOKU_LEN) + i);
            if (!nums[currNum - 1])
            {
                nums[currNum - 1] = 1;
            }
            else
            {
                return false;
            }
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

bool validateAllSubMatrices(const int *sudoku)
{
    for (int i = 0; i < SUDOKU_LEN; i += 3)
    {
        for (int j = 0; j < SUDOKU_LEN; j += 3)
        {
            if (!validateSubMatrix(sudoku + (i * SUDOKU_LEN) + j))
            {
                return false;
            }
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
    char mat[SUDOKU_LEN * SUDOKU_LEN];
    int matCount;
    read(STDIN_FILENO, &matCount, sizeof(int));

    for (int i = 0; i < matCount; i++)
    {
        read(STDIN_FILENO, mat, sizeof(char) * SUDOKU_LEN * SUDOKU_LEN);
        int res = validateAllSubMatrices(getSudokuFromString(mat));
        write(STDOUT_FILENO, &res, sizeof(int));
    }

    return 0;
}