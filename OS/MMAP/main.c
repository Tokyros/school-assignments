#include <stdio.h>
#include <zconf.h>
#include <stdbool.h>
#include <sys/mman.h>
#include <sys/wait.h>

#define SUDOKU_LEN 9

typedef struct
{
    int matrix[SUDOKU_LEN][SUDOKU_LEN];
    bool status;
} Sudoku;

bool validateRow(Sudoku sudoku, int row)
{
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        int currNum = sudoku.matrix[row][i];
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

bool validateAllRows(Sudoku sudoku)
{
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        if (!validateRow(sudoku, i))
        {
            return false;
        }
    }
    return true;
}

bool validateCol(Sudoku sudoku, int col)
{
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        int currNum = sudoku.matrix[i][col];
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

bool validateAllCols(Sudoku sudoku)
{
    for (int i = 0; i < SUDOKU_LEN; ++i)
    {
        if (!validateCol(sudoku, i))
        {
            return false;
        }
    }
    return true;
}

bool validateSubMatrix(Sudoku sudoku, int row, int col)
{
    int nums[SUDOKU_LEN] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = row; i < row + 3; ++i)
    {
        for (int j = col; j < col + 3; ++j)
        {
            int currNum = sudoku.matrix[i][j];
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

bool validateAllSubMatices(Sudoku sudoku)
{
    for (int i = 0; i < SUDOKU_LEN; i += 3)
    {
        for (int j = 0; j < SUDOKU_LEN; j += 3)
        {
            if (!validateSubMatrix(sudoku, i, j))
            {
                return false;
            }
        }
    }
    return true;
}

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

int main(int argc, char *argv[])
{
    for (int i = 1; i < argc; i++)
    {
        char *fileName = argv[i];
        bool *validators = (bool *)mmap(NULL, 3 * sizeof(bool), PROT_READ | PROT_WRITE, MAP_ANON | MAP_SHARED, -1, 0);
        Sudoku sudoku = readSudokuFile(fileName);
        if (!sudoku.status)
        {
            sudoku = getSudokuFromInput();
        }

        if (!fork())
        {
            validators[0] = validateAllRows(sudoku);
            return 0;
        }
        else if (!fork())
        {
            validators[1] = validateAllCols(sudoku);
            return 0;
        }
        else if (!fork())
        {
            validators[2] = validateAllSubMatices(sudoku);
            return 0;
        }
        else
        {
            wait(NULL);
            wait(NULL);
            wait(NULL);
            bool boardValid = validators[0] && validators[1] && validators[2];
            if (!sudoku.status)
            {
                if (!boardValid)
                {
                    printf("Your board is illegal!\n");
                }
                else
                {
                    printf("Your board is legal\n");
                }
            }
            else
            {
                if (!boardValid)
                {
                    printf("%s is illegal!\n", fileName);
                }
                else
                {
                    printf("%s is legal\n", fileName);
                }
            }
        }
        munmap(validators, 3 * sizeof(bool));
    }
    return 0;
}
