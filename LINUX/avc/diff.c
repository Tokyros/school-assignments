#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char* argv[]) {
    char c1;
    char c2;

    if (argc != 3) {
        fprintf(stderr, "Wrong number of arguments passed, expected 2 arguments\nUsage: %s fileName fileName\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    FILE* f1 = fopen(argv[1], "r");
    FILE* f2 = fopen(argv[2], "r");

    if (f1 == NULL || f2 == NULL) {
        printf("Could not read one of the files\n");
        exit(EXIT_FAILURE);
    }

    while (c1 != EOF && c2 != EOF) {
        c1 = fgetc(f1);
        c2 = fgetc(f2);
        if (c1 != c2) {
            printf("Files do not match\n");
            exit(EXIT_SUCCESS);
        }
    }

    if (c1 != EOF || c2 != EOF) {
        printf("Files do not match\n");
        exit(EXIT_SUCCESS);
    }

    printf("Files match\n");
}