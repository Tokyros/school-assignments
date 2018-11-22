#include "pictureManipulation.h"

void pictureManipulation()
{
    int mat[MAT_SIZE][MAT_SIZE];
    int shouldShowMenu = 1;

    initRandomMat((int*)mat, MAT_SIZE, MAT_SIZE);
    printMat((int*)mat, MAT_SIZE, MAT_SIZE);

    while (shouldShowMenu)
    {
    	shouldShowMenu = showMenu((int*)mat);
    }
}

// Returns 0 if user decided to quit, otherwise 1
int showMenu(int *mat)
{
	int choice;
    printf(MENU_TEXT);
    scanf("%d", &choice);
    switch (choice)
    {
    case 1:
        rotate90ClockWise(mat, MAT_SIZE, MAT_SIZE);
        break;
    case 2:
        rotate90CounterClockWise(mat, MAT_SIZE, MAT_SIZE);
        break;
    case 3:
        flipVertically(mat, MAT_SIZE, MAT_SIZE);
        break;
    case 4:
        flipHorizontally(mat, MAT_SIZE, MAT_SIZE);
        break;
    case -1:
            return 0;
    default:
    	printf(INVALID_CHOICE);
    }
    printf(AFTER_MANIPULATION_HEADER);
    printMat(mat, MAT_SIZE, MAT_SIZE);
    return 1;
}

void initRandomMat(int *mat, int rows, int cols)
{
    int i, z;
    for (i = 0; i < rows; i++)
    {
        for (z = 0; z < cols; z++)
        {
            *(mat + i * cols + z) = rand() % (MAX - MIN + 1);
        }
    }
}

void rotate90ClockWise(int *mat, int rows, int cols)
{
    transposeMat(mat, rows, cols);
    flipHorizontally(mat, rows, cols);
}

void rotate90CounterClockWise(int *mat, int rows, int cols)
{
    transposeMat(mat, rows, cols);
    flipVertically(mat, rows, cols);
}

void transposeMat(int *mat, int rows, int cols)
{
    int i, j;
    for (i = 0; i < cols; i++)
    {
        for (j = 0; j <= i; j++)
        {
            swap(mat, j, i, i, j, cols);
        }
    }
}

void flipHorizontally(int *mat, int rows, int cols)
{
    int i, j;
    for (i = 0; i < rows; i++)
    {
        for (j = 0; j < cols / 2; j++)
        {
            swap(mat, i, j, i, cols - 1 - j, cols);
        }
    }
}

void flipVertically(int *mat, int rows, int cols)
{
	int i, j;
    for (i = 0; i < cols; i++)
    {
        for (j = 0; j < rows / 2; j++)
        {
            swap(mat, j, i, rows - 1 - j, i, cols);
        }
    }
}
