#include <stdio.h>
#include <stdlib.h>

#define INT_MAX 9999999
#define MAT_LEN 3

int **m = {NULL};
int **ks = {NULL};

void printOptimal(int i, int j)
{
    if (i == j)
    {
        printf(" A%d ", i);
    }
    else
    {
        printf("(");
        printOptimal(i, ks[i][j]);
        printOptimal(ks[i][j] + 1, j);
        printf(")");
    }
}

int MatrixChainOrder(int p[], int n)
{
    int i, j, k, L, q;

    for (L = 2; L < n; L++)
    {
        for (i = 1; i < n - L + 1; i++)
        {
            j = i + L - 1;
            m[i][j] = INT_MAX;
            for (k = i; k <= j - 1; k++)
            {
                q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (q < m[i][j])
                {
                    m[i][j] = q;
                    ks[i][j] = k;
                }
            }
        }
    }
    return m[1][n - 1];
}

int main()
{
    int arr[] = {10, 100, 5, 50};
    int size = sizeof(arr) / sizeof(arr[0]);

    m = (int **)malloc(sizeof(int *) * (size + 1));
    ks = (int **)malloc(sizeof(int *) * (size + 1));
    for (int i = 0; i <= size; i++)
    {
        m[i] = (int *)malloc((size + 1) * sizeof(int));
        ks[i] = (int *)malloc((size + 1) * sizeof(int));
    }

    for (int i = 1; i <= size; i++)
    {
        for (int j = i + 1; j <= size; j++)
        {
            m[i][i] = 0;
            ks[i][j] = 0;
            m[i][j] = (int)INT_MAX;
        }
    }

    MatrixChainOrder(arr, size);

    printOptimal(1, size - 1);
    printf("\n");

    return 0;
}
