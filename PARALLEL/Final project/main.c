#include <omp.h>
#include <mpi.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "cipher.h"
#include "cudaFunctions.h"

#define MPI_THREAD_COUNT 4

char* decimalToBinary(int n) {
   int i = 0;
   char *binary = (char*) malloc(sizeof(char) * 4);
   binary = strdup("0000");
   if (n == 0) {
      return binary;
   }
   while (n > 0) {
      binary[4 - 1 - i] = n % 2 + '0';
      n = n / 2;
      i++;
   }
   return binary;
}

int numToBinaryLength(int num) {
	int res = 0;
	while (num != 0) {
		num /= 2;
		res++;
	}

	return res;
}

char* numToBinaryString(int num) {
	int stringLength = numToBinaryLength(num);
	char* binaryString = (char*) malloc(sizeof(char) * (stringLength ));
	binaryString = strdup("0000");
	for (int c = 0; c < stringLength; c++) {
		binaryString[stringLength - c - 1] = num % 2 + '0';
		num /= 2;
	}

	// binaryString[stringLength] = '\0';

	printf("numlen: %d = %s\n", stringLength, binaryString);
	return binaryString;
}

int isValidText(char *text, char *knownWords) {
	const char separator[2] = "\n";
	char *word;
	
	word = strtok(knownWords, separator);
	int matchCount = 0;
	
	while( word != NULL ) {
		if (strstr(text, word) != NULL) {
			matchCount++;
		}
		word = strtok(NULL, separator);
	}

	return matchCount;
}

char* decipherWithKey(int key, int keyLen, char* data, int data_length) {
	char* binaryString = decimalToBinary(key);
	// char* binaryString = numToBinaryString(key);
	printf("%d = %s\n", key, binaryString);

	binaryStringToBinary(binaryString, keyLen);
	char* deciphered = cipherString(binaryString, keyLen, data, data_length);
	deciphered = (char*) realloc(deciphered, sizeof(char) * data_length + 1);
	deciphered[data_length] = '\0';
	return deciphered;
}

void OpenMPTask(char *data, int data_length, char *words, int fromKey, int toKey, int* key, int keyLen, int* bestMatch) {
	omp_set_num_threads(8);

	#pragma omp parallel for
	for (int i = fromKey; i < toKey; i++) {
		char* deciphered = decipherWithKey(i, keyLen, data, data_length);
		// printf("key: %d - dec: %s\n",i, deciphered);
		int match = isValidText(deciphered, words);
		// printf("Thread: %d\n", omp_get_thread_num());
		// printf("key: %d - match: %d - best: %d\n", i, match, *bestMatch);
		// #pragma omp critical
		// {
			if (match > *bestMatch) {
				*key = i;
				*bestMatch = match;
			}
		// }
		
		

		free(deciphered);
	}
}

int main(int argc, char *argv[])
{
	int currentProcess, processCount;

	MPI_Init(&argc, &argv);
	MPI_Comm_size(MPI_COMM_WORLD, &processCount);

	MPI_Comm_rank(MPI_COMM_WORLD, &currentProcess);

	int inputSize, knownWordsLength, keyLength;
	int fromKey, toKey, keyOptions;
	char *data, *knownWordsString;
	MPI_Status mpiStatus;
	int res = NULL, bestMatch = 0;


	if (currentProcess == 1)
	{
		MPI_Recv(&inputSize, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&knownWordsLength, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&keyOptions, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&keyLength, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		
		data = (char *) malloc(sizeof(char) * (inputSize));
		knownWordsString = (char *) malloc(sizeof(char) * (knownWordsLength));
		
		fromKey = (int) keyOptions / 2 + 1;
		toKey = (int) keyOptions;

		MPI_Recv(data, inputSize, MPI_CHAR, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(knownWordsString, knownWordsLength, MPI_CHAR, 0, 0, MPI_COMM_WORLD, &mpiStatus);

	}
	else
	{
		keyLength = atoi(argv[1]);
		keyOptions = (int) pow(2, keyLength);
		FILE *file = fopen(argv[2], "r");
		if (!file)
		{
			printf("Could not open data.txt\n");
			exit(0);
		}

		FILE *knownWordsFile = fopen(argv[3], "r");
		if (!knownWordsFile) {
			printf("Could not open %s\n", argv[3]);
			exit(0);
		}

		knownWordsString = readStringFromFile(knownWordsFile, 512, &knownWordsLength);
		data = readStringFromFile(file, 512, &inputSize);

		fromKey = 0;
		toKey = (int) keyOptions / 2;

		MPI_Send(&inputSize, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
		MPI_Send(&knownWordsLength, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);					 
		MPI_Send(&keyOptions, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
		MPI_Send(&keyLength, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);

		MPI_Send(data, inputSize, MPI_CHAR, 1, 0, MPI_COMM_WORLD);
		MPI_Send(knownWordsString, knownWordsLength, MPI_CHAR, 1, 0, MPI_COMM_WORLD);
	}

	// if (currentProcess == 1)
	OpenMPTask(data, inputSize, knownWordsString, fromKey, toKey, &res, keyLength, &bestMatch);

	if (currentProcess == 1) {
		MPI_Send(&res, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
		MPI_Send(&bestMatch, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
	} else {
		int otherRes;
		int otherBestMatch;
		MPI_Recv(&otherRes, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&otherBestMatch, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &mpiStatus);

		printf("otherRes: %d, otherMatch: %d\nres: %d, match: %d\n", otherRes, otherBestMatch, res, bestMatch);
		if (res == NULL && otherRes == NULL) {
			printf("Could not find key :(\n");
		} else if (bestMatch > otherBestMatch) {
			printf("found key - %d, deciphered string is:\n%s\n", res, decipherWithKey(res, keyLength, data, inputSize));
		} else {
			printf("found key - %d, deciphered string is:\n%s\n", otherRes, decipherWithKey(otherRes, keyLength, data, inputSize));
		}
	}

	free(data);
	free(knownWordsString);

	MPI_Finalize();
	return 0;
}
