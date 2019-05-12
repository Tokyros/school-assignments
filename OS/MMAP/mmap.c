#include "main.h"

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
    Shared *shared = (Shared *)mmap(NULL, sizeof(Shared), PROT_READ | PROT_WRITE, MAP_ANON | MAP_SHARED, -1, 0);

    if (!fork())
    {
        while (!shared->done)
        {
            // Wait for parent process to signal matrix is ready for check
            while (!shared->ready){
                shared->waiting[0] = true; 
            }
            shared->waiting[0] = false;
            shared->valid = shared->valid && validateAllRows(shared->sudoku);
            shared->handled[0] = true;
        }
    }
    else if (!fork())
    {
        while (!shared->done) {
            // Wait for parent process to signal matrix is ready for check
            while (!shared->ready){
                shared->waiting[1] = true;
            }
            shared->waiting[1] = false;

            shared->valid = shared->valid && validateAllCols(shared->sudoku);
            shared->handled[1] = true;
        }
    }
    else if (!fork())
    {
        while (!shared->done)
        {
            // Wait for parent process to signal matrix is ready for check
            while (!shared->ready){
                shared->waiting[2] = true;
            }
            shared->waiting[2] = false;
            shared->valid = shared->valid && validateAllSubMatices(shared->sudoku);
            shared->handled[2] = true;
        }

        return 0;
    }
    else
    {
        for (int i = 1; i < argc; i++)
        {
            // Initialise matrix check
            shared->ready = false;
            while (!(shared->waiting[0] && shared->waiting[1] && shared->waiting[2])){}
            shared->valid = true;
            shared->handled[0] = false;
            shared->handled[1] = false;
            shared->handled[2] = false;
            // Read one matrix, either from file or input
            char *fileName = argv[i];
            Sudoku sudoku = readSudokuFile(fileName);
            shared->sudoku = sudoku.status ? sudoku : getSudokuFromInput();
            // shared memory is ready to be processed by child processes
            shared->ready = true;
            // Wait for child processes to finish checking matrix
            while (!(shared->handled[0] && shared->handled[1] && shared->handled[2])){}

            if (!sudoku.status)
            {
                if (!shared->valid)
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
                if (!shared->valid)
                {
                    printf("%s is not legal!\n", fileName);
                }
                else
                {
                    printf("%s is legal\n", fileName);
                }
            }
        }
    }
    shared->done = true;
    munmap(shared, sizeof(Shared));
    return 0;
}
