#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#define START_SIZE 512
#define EXTEND_SIZE 32
#define MAX_KEY_SIZE 4

char *readStringFromFile(FILE *fp, size_t allocated_size, int *input_length)
{
    char *string;
    int ch;
    *input_length = 0;
    string = (char*)realloc(NULL, sizeof(char) * allocated_size);
    if (!string)
        return string;
    while (EOF != (ch = fgetc(fp)))
    {
        if (ch == EOF)
            break;
        string[*input_length] = ch;
        *input_length += 1;
        if (*input_length == allocated_size)
        {
            string = (char*)realloc(string, sizeof(char) * (allocated_size += EXTEND_SIZE));
            if (!string)
                return string;
        }
    }
    return (char*)realloc(string, sizeof(char) * (*input_length));
}

void binaryStringToBinary(char *string, size_t num_bytes)
{
    int i,byte;
    unsigned char binary_key[MAX_KEY_SIZE];
    for(byte = 0;byte<num_bytes;byte++)
    {
        binary_key[byte] = 0;
        for(i=0;i<8;i++)
        {
            binary_key[byte] = binary_key[byte] << 1;
            binary_key[byte] |= string[byte*8 + i] == '1' ? 1 : 0;  
        }
    }
    memcpy(string,binary_key,num_bytes);
}

char* cipherString(char* key, size_t key_len, char* input_str, int input_length) {
    int i, j = 0;
    char *output_str = (char*)malloc(input_length * sizeof(char));
    if (!output_str)
    {
        fprintf(stderr, "Error allocating memory\n");
        exit(0);
    }
    for (i = 0; i < input_length; i++, j++)
    {
        if (j == key_len)
            j = 0;
        output_str[i] = input_str[i] ^ key[j];
    }
    return output_str;
}
