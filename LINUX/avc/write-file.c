#include <stdlib.h>
#include <stdio.h>

int main(int argc, char* argv[]) {
    FILE* file = fopen(argv[1], "w");

    if (file == NULL) {
        printf("Error: Could not create output file\n");
        exit(1);
    }

    char c;
    while ((c = getc(stdin)) != EOF) {
        fputc(c, file);
    }

    fclose(file);
}
