#include <stdio.h>
#include <unistd.h>

int main(int argc, char* argv[]) {
    FILE* f1 = fopen(argv[1], "r");
    FILE* f2 = fopen(argv[2], "r");

    if (f1 == NULL || f2 == NULL) {
        printf("Could not read one of the files\n");
        exit(1);
    }

    char c1;
    char c2;

    while ((c1 = fgetc(f1)) != EOF && (c2 = fgetc(f2)) != EOF) {
        printf("%c <-> %c\n", c1, c2);
        if (c1 != c2) {
            printf("Files do not match\n");
            exit(0);
        }
    }

    // TODO make this work
    if (c1 != EOF || c2 != EOF) {
        printf("Files do not match\n");
        exit(0);
    }

    printf("Files match\n");
}