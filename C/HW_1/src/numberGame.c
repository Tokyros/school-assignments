#include "numberGame.h"

#define INVALID_CHOICE "Invalid choice!\n"
#define YOU_WIN "You win! The game is over!\n"
#define YOUR_STEP "Your step: "

void numberGame()
{
    int mat[NUM_ROWS][NUM_COLS];
    playNumberGame((int*)mat, NUM_ROWS, NUM_COLS);
}

void playNumberGame(int *mat, int rows, int cols)
{
	int choice, emptyIndex;
    initMatNumberGame(mat, NUM_ROWS, NUM_COLS);

	shuffleMat(mat, NUM_ROWS, NUM_COLS);

    emptyIndex = findEmptyIndex(mat, NUM_ROWS, NUM_COLS);

    while (!gameIsSolved(mat, NUM_ROWS, NUM_COLS))
    {
    	printMat(mat, NUM_ROWS, NUM_COLS);

    	do {
    		printf(YOUR_STEP);
    		scanf("%d", &choice);
    	} while (!maybePlayStep(mat, choice, &emptyIndex, rows, cols));
    }

    printf(YOU_WIN);
}

int findEmptyIndex(int *mat, int rows, int cols)
{
	int i;
	for (i = 0; i < rows * cols; i++)
	{
		if (*(mat + i) == 0)
		{
			return i;
		}
	}
	return -1;
}

int gameIsSolved(int *mat, int rows, int cols)
{
	int i;

	if (*(mat + (rows - 1)*cols + cols - 1) != 0 || *mat != 1)
	{
		return 0;
	}

	for (i = 0; i < rows * cols - 2;i++, mat++)
	{
		if (*(mat + 1) - *mat != 1)
		{
			return 0;
		}
	}
	return 1;
}

void initMatNumberGame(int *mat, int rows, int cols)
{
    int i, j, z = 0;
    for (i = 0; i < rows; i++)
    {
        for (j = 0; j < cols; j++)
        {
            *(mat + i * cols + j) = z++;
        }
    }
}

void shuffleMat(int *mat, int rows, int cols)
{
	int i;
	for (i = 0; i < SHUFFLE_COUNT; i++)
	{
		swap(mat, rand() % (rows), rand() % (cols), rand() % (rows), rand() % (cols), cols);
	}
}

int maybePlayStep(int *mat, int choice, int *emptyIndex, int rows, int cols)
{
	int i;
	int diff;
	if (choice > 0 && choice < rows * cols)
	{
		for (i = 0; i < rows * cols; i++)
		{
			if (choice == *(mat + i))
			{
				diff = (i - *emptyIndex);
				switch(diff)
				{
					case -1:
					case 1:
					case NUM_COLS:
					case -NUM_COLS:
						swap(mat, i / cols, i % cols, *emptyIndex / cols, *emptyIndex % cols, cols);
						*emptyIndex = i;
						return 1;
					default:
						printf(INVALID_CHOICE);
						return 0;
				}
			}
		}
	}
	printf(INVALID_CHOICE);
	return 0;
}
