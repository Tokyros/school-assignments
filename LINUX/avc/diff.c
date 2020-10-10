#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char* argv[]) {
    char *inputFileName;
    char *outputFileName;
    int opt;
    char c1;
    char c2;

    while ((opt = getopt(argc, argv, "i:o:")) != -1) {
        switch(opt) {
            case 'i':
                inputFileName = optarg;
                break;
            case 'o':
                outputFileName = optarg;
                break;
            default:
                fprintf(stderr, "Usage: %s [-i inputFileName] [-o outputFileName]\n", argv[0]);
                exit(EXIT_FAILURE);
        }
    }

    FILE* f1 = fopen(inputFileName, "r");
    FILE* f2 = fopen(outputFileName, "r");

    if (f1 == NULL || f2 == NULL) {
        printf("Could not read one of the files\n");
        exit(EXIT_FAILURE);
    }

    while (c1 != EOF && c2 != EOF) {
        c1 = fgetc(f1);
        c2 = fgetc(f2);
        printf("%c <-> %c\n", c1, c2);
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