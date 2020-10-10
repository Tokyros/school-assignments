#include <stdio.h>

int main(int argc, char* argv[]) {
    FILE* input = fopen(argv[1], "r");

    char c;
    while ((c = fgetc(input)) != EOF) {
        putc(c, stdout);
    }

    putc('\n', stdout);

    fflush(stdout);

    fclose(input);
}