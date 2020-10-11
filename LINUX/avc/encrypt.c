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
    // if (argc != 5) {
    //     printf("Error: Script expects 4 arguments:\n");
    //     printf("1: n part of RSA key\n");
    //     printf("2: d/e part of RSA key (d - decrypting, e - encrypting)\n");
    //     printf("3: file to encrypt/decrypt\n");
    //     printf("4: file to write encrypted/decrypted\n");
    //     exit(1);
    // }
    int n, key_part, opt;
    char temp;
    if (argc < 2) {
        printf("No key was passed!\n");
        exit(EXIT_FAILURE);
    }
    char *keyName, *inputFileName, *outputFileName;

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
    FILE *inputFile = fopen(inputFileName, "r");
    FILE *outputFile = fopen(outputFileName, "w");

    fscanf(key, "%d %d", &n, &key_part);

    if (!n || !key_part) {
        printf("RSA key parts must be positive integers\n");
        exit(1);
    }

    // FILE* input = fopen(argv[3], "r");

    // if (input == NULL) {
    //     fprintf(stderr, "Could not read input file\n");
    //     exit(1);
    // }

    // FILE* output = fopen(argv[4], "w");

    // if (output == NULL) {
    //     fprintf(stderr, "Could not read output file\n");
    //     exit(1);
    // }

    char c;
    while ((c = fgetc(inputFile)) != EOF) {
        putc(power((unsigned char) c, key_part, n), outputFile);
        // fputc(power((unsigned char) c, key_part, n), output);
    }

    fclose(key);
    fclose(inputFile);
    fclose(outputFile);

    // printf("Wrote encrypted message to %s\n", argv[4]);
}