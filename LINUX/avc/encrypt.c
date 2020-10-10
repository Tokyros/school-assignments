#include <stdio.h>
#include <stdlib.h>

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

    int n = atoi(argv[1]);
    int key_part = atoi(argv[2]);

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
    while ((c = fgetc(stdin)) != EOF) {
        putc(power((unsigned char) c, key_part, n), stdout);
        // fputc(power((unsigned char) c, key_part, n), output);
    }

    // fclose(output);
    // fclose(input);

    // printf("Wrote encrypted message to %s\n", argv[4]);
}