#include <stdio.h>
#include <stdlib.h>
#include <omp.h>

int main() {
    int N = 100;
    int* input = malloc(N * sizeof(float));

    // temp
    for (int i = 0; i < N; i++)
    {
        input[i] = i;
    }
    

    #pragma omp parallel 
    {
        int privateHist[256];
        int from = omp_get_thread_num() * N/omp_get_num_threads();
        int to = ((1+omp_get_thread_num()) * N/omp_get_num_threads()) - 1;

        for (int i = 0; i < N; i++)
        {
            if (input[i] <= to && input[i] >= from) {
                printf("input %d\n", input[i]);
                privateHist[input[i]]++;
            }
        }
        
        printf("will check from %d to %d\n", from, to);
        for (int i = 0; i < 256; i++)
        {
            // printf("%d ", privateHist[i]);
        }
        printf("\n");
    }
}