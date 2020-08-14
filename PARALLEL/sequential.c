#include <stdio.h>
#include <math.h>
#include <mpi.h>
#define HEAVY 100000
#define SHORT 1
#define LONG 10
#define N 20.0

// This function performs heavy computations,
// its run time depends on x and y values
double heavy(int x, int y)
{
    int i, loop = SHORT;
    double sum = 0;

    // Super heavy tasks
    if (x < 3 || y < 3)
        loop = LONG;
    // Heavy calculations
    for (i = 0; i < loop * HEAVY; i++)
        sum += cos(exp(sin((double)i / HEAVY)));
    return sum;
}

// Execute part of the computation
double calculateAnswer(int from, int to)
{
    int x, y;
    double answer = 0;
    for (x = from; x < to; x++)
        for (y = 0; y < N; y++)
            answer += heavy(x, y);
    return answer;
}

int main(int argc, char *argv[])
{
    MPI_Init(NULL, NULL);

    printf("==========Running task sequentially==========\n");
    double start = MPI_Wtime();
    calculateAnswer(0, N);
    printf("Sequential took %f seconds\n\n", MPI_Wtime() - start);

    MPI_Finalize();
}