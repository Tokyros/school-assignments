#include <omp.h>

int main() {
    #pragma omp parallel
    {
        int ID = 0;
        printf("hello(%d)", ID);
        printf(" world(%d)\n", ID)
    }
}