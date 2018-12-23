
typedef struct {
    int* numbers;
    int countOfOnesInRow;
} DNFRow;

typedef struct {
    int size;
    int rowsOfOneCount;
    DNFRow** rows;
} DNFMat;

void initMat(int size, DNFMat* mat) {
    int i;
    int z;
    mat->rowsOfOneCount = size;
    mat->size = size;
    for (i = 0; i < size; i++) {
        int* numbers = malloc(sizeof(int) * size);
        for (z = 0; z < size; z++) {
            numbers[z] = 1;
        }

        DNFRow row = {numbers, size};
        (mat->rows)[i] = row;
    }
}

void flip(DNFMat* mat, int i, int j) {
    int current = mat->rows[i]->numbers[j];
    if (current == 0) {
        mat->rows[i]->numbers[j] = 1;
        mat->rows[i]->countOfOnesInRow++;
        if (mat->rows[i]->countOfOnesInRow == mat->size) {
            mat->rowsOfOneCount++;
        }
    } else {
        mat->rows[i]->numbers[j] = 0;
        mat->rows[i]->countOfOnesInRow--;
        if (mat->rows[i]->countOfOnesInRow == mat->size-1) {
            mat->rowsOfOneCount--;
        }
    }
}

int DNF(DNFMat* mat) {
    return mat->rowsOfOneCount > 0;
}
