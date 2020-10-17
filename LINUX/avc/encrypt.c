#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int power(int x, unsigned int y, int p) 
{ 
    int res = 1;
  
    x = x % p;
  
    if (x == 0) return 0;
  
    while (y > 0) 
    { 
        if (y % 2 == 1)
            res = (res * x) % p; 
  
        y = y / 2;
        x = (x*x) % p;   
    } 
    return res; 
}

int main(int argc, char* argv[]) {
    int n, key_part, opt;
    char temp;
    char *keyName, *inputFileName, *outputFileName;

    if (argc == 1) {
        fprintf(stderr, "Usage: %s [-k keyFileName] [-i inputFileName] [-o outputFileName]\n", argv[0]);
        exit(EXIT_FAILURE); 
    }

     while ((opt = getopt(argc, argv, "k:i:o:")) != -1) {
        switch(opt) {
            case 'k':
                keyName = optarg;
                break;
            case 'i':
                inputFileName = optarg;
                break;
            case 'o':
                outputFileName = optarg;
                break;
            default:
                fprintf(stderr, "Usage: %s [-k keyFileName] [-i inputFileName] [-o outputFileName]\n", argv[0]);
                exit(EXIT_FAILURE);
        }
    }

    FILE *key = fopen(keyName, "r");
    if (!key) {
        printf("Could not open file %s", keyName);
        exit(EXIT_FAILURE);
    }
    FILE *inputFile = fopen(inputFileName, "r");
    if (!inputFile) {
        printf("Could not open file %s", inputFileName);
        exit(EXIT_FAILURE);
    }
    FILE *outputFile = fopen(outputFileName, "w");
    if (!outputFile) {
        printf("Could not open file %s", outputFileName);
        exit(EXIT_FAILURE);
    }

    fscanf(key, "%d %d", &n, &key_part);

    if (!n || !key_part) {
        printf("RSA key parts must be positive integers\n");
        exit(EXIT_FAILURE);
    }

    char c;
    while ((c = fgetc(inputFile)) != EOF) {
        putc(power((unsigned char) c, key_part, n), outputFile);
    }

    fclose(key);
    fclose(inputFile);
    fclose(outputFile);

    printf("Wrote encrypted message to %s\n", outputFileName);
    exit(EXIT_SUCCESS);
}