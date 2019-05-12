#include "validate_col.h"

bool validateCol(const int *sudoku)
{
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        int currNum = *(sudoku + (i * SUDOKU_LEN));
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

bool validateAllCols(const int *sudoku)
{
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        if (!validateCol(sudoku + i))
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
    char mat[SUDOKU_LEN * SUDOKU_LEN];
    int matCount;
    read(STDIN_FILENO, &matCount, sizeof(int));

    for (int i = 0; i < matCount; i++)
    {
        read(STDIN_FILENO, mat, sizeof(char) * SUDOKU_LEN * SUDOKU_LEN);
        int res = validateAllCols(getSudokuFromString(mat));
        write(STDOUT_FILENO, &res, sizeof(int));
    }

    return 0;
}