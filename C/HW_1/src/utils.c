#include "utils.h"

void swap(int* mat, int rowI, int colI, int rowJ, int colJ, int cols)
{
	int *locI = (mat + rowI*cols + colI);
	int *locJ = (mat + rowJ*cols + colJ);

	int temp = *locI;
	*locI = *locJ;
	*locJ = temp;
}


void printMat(int *mat, int rows, int cols)
{
    int i, j;
    for (i = 0; i < rows; i++)
    {
        for (j = 0; j < cols; j++)
        {

            printf("\t%d ", *mat);
            mat++;
        }
        printf("\n");
    }
    printf("\n");
}


char getChar()
{
	char c;
    do
    {
        scanf("%c", &c);
    } while (isspace(c));
    return c;
}
