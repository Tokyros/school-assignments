#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <unistd.h>
#include <string.h>

int concatenateNums(int x, int y) {
    int n, z = 0;
    
    n = y;

    while(n>0)
    {
        z++;
        n /= 10;
    }

    return x * pow(10, z) + y;
}

char* readFile(char fileName[]) {
    FILE *fp;
    long lSize;
    char *buffer;

    fp = fopen ( fileName , "rb" );
    if( !fp ) {
        exit(1);
    };

    fseek( fp , 0L , SEEK_END);
    lSize = ftell(fp);
    rewind(fp);

    buffer = calloc( 1, lSize+1 );
    if( !buffer ) {
        fclose(fp);
        fputs("memory alloc fails", stderr);
        exit(1);
    }

    if(1 != fread( buffer , lSize, 1 , fp)) {
        fclose(fp);
        free(buffer);
        fputs("entire read fails",stderr);
        exit(1);
    }

    return buffer;
}

int main(int argc, char* argv[]) {
    int opt;
    char *inputFileName, *outputFileName;

    if (argc == 1) {
        fprintf(stderr, "Usage: %s [-i inputFileName] [-o outputFileName]\n", argv[0]);
        exit(EXIT_FAILURE);
    }

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

    FILE* output = fopen(outputFileName, "w");

    if (output == NULL) {
        printf("Could not read output file\n");
        exit(1);
    }

    char* fileContent = readFile(inputFileName);
    int contentLength = strlen(fileContent);

    int hash = 0;

    for (int z = 0; z < contentLength; z += 2) {
        hash += concatenateNums(fileContent[z], fileContent[z + 1]) % 100000;
        hash %= 100000;
    }
    
    free(fileContent);
    fprintf(output, "%d\n", hash);
    fclose(output);
}