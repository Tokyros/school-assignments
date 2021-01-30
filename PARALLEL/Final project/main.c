#include <omp.h>
#include <mpi.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "simple_hash.h"
#include "cipher.h"
#include "cudaFunctions.h"

#define MPI_THREAD_COUNT 4

char* numToBinaryString(int num, int keyLen) {
	char* binaryString = (char*) malloc(sizeof(char) * (keyLen * 8));
	for (int i = 0; i < keyLen; i++) {
		binaryString[i] = '0';
	}

	for (int c = 0; num > 0 && c < keyLen; c++) {
		binaryString[keyLen - c - 1] = num % 2 + '0';
		num /= 2;
	}

	return binaryString;
}

int countValidWords(char *text, hashset_t knownWords) {
	const char separator[3] = " \n";
	char *word;
	
	word = strtok(text, separator);
	int matchCount = 0;
	
	while( word != NULL ) {
		if (hashset_is_member(knownWords, word, strlen(word)) == 1) {
			matchCount++;
		}
		word = strtok(NULL, separator);
	}

	return matchCount;
}

char* decipherWithKey(int key, int keyLen, char* data, int data_length) {
	char* binaryString2 = numToBinaryString(key, keyLen);
	binaryStringToBinary(binaryString2, keyLen);
	char* deciphered = cipherString(binaryString2, keyLen, data, data_length);
	free(binaryString2);
	deciphered = (char*) realloc(deciphered, data_length + 1);
	deciphered[data_length] = '\0';
	return deciphered;
}

hashset_t createWordsHashset(char* words) {
	hashset_t set = hashset_create();
	const char separator[2] = "\n";
	char *word;
	char *knownWordsTmp = strdup(words);
	
	word = strtok(knownWordsTmp, separator);
	int matchCount = 0;
	
	while( word != NULL ) {
		hashset_add(set, word, strlen(word));
		word = strtok(NULL, separator);
	}

	return set;
}

typedef struct {
	int key;
	int matchCount;
} MP_Result;

MP_Result OpenMPTask(char *data, int data_length, hashset_t words, int fromKey, int toKey, int keyLen) {
	int bestKey = -1;
	int bestMatch = -1;
	
	omp_set_num_threads(16);
	#pragma omp parallel for
	for (int key = fromKey; key < toKey; key++) {
		char* deciphered = decipherWithKey(key, keyLen, data, data_length);	
		int validWordsCount = countValidWords(deciphered, words);

		if (validWordsCount > bestMatch) {
			#pragma omp critical
			{
				bestKey = key;
				bestMatch = validWordsCount;
			}
		}
		free(deciphered);
	}

	MP_Result res = {bestKey, bestMatch};

	return res;
}

int main(int argc, char *argv[])
{
	int currentProcess, processCount;

	MPI_Init(&argc, &argv);
	MPI_Comm_size(MPI_COMM_WORLD, &processCount);

	MPI_Comm_rank(MPI_COMM_WORLD, &currentProcess);

	hashset_t wordsSet;
	int inputSize, knownWordsLength, keyLength;
	int fromKey, toKey, keyOptions;
	char *data, *knownWordsString;
	MPI_Status mpiStatus;
	int encryptionKey = -1, bestMatch = 0;


	if (currentProcess == 1)
	{
		MPI_Recv(&inputSize, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&knownWordsLength, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&keyOptions, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&keyLength, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		
		data = (char *) malloc(sizeof(char) * (inputSize));
		knownWordsString = (char *) malloc(sizeof(char) * (knownWordsLength));
		
		MPI_Recv(data, inputSize, MPI_CHAR, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(knownWordsString, knownWordsLength, MPI_CHAR, 0, 0, MPI_COMM_WORLD, &mpiStatus);

		fromKey = (int) keyOptions / 2 + 1;
		toKey = (int) keyOptions;
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

		FILE *knownWordsFile;
		if (argc > 3) {
			knownWordsFile = fopen(argv[3], "r");
		} else {
			printf("No words file passed, using default file\n");
			knownWordsFile = fopen("defaultWords.txt", "r");
		}
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

	wordsSet = createWordsHashset(knownWordsString);
	MP_Result res = OpenMPTask(data, inputSize, wordsSet, fromKey, toKey, keyLength);
	printf("Result is - key=%d, match=%d\n", res.key, res.matchCount);
	encryptionKey = res.key;
	bestMatch = res.matchCount;

	if (currentProcess == 1) {
		MPI_Send(&encryptionKey, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
		MPI_Send(&bestMatch, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
	} else {
		int otherEncryptionKey;
		int otherBestMatch;
		MPI_Recv(&otherEncryptionKey, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&otherBestMatch, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &mpiStatus);

		printf("otherEncryptionKey: %d, otherMatch: %d\nres: %d, match: %d\n", otherEncryptionKey, otherBestMatch, encryptionKey, bestMatch);
		if (encryptionKey == -1 && otherEncryptionKey == -1) {
			printf("Could not find key :(\n");
		} else if (bestMatch > otherBestMatch) {
			printf("found key - %d, deciphered string is:\n%s\n", encryptionKey, decipherWithKey(encryptionKey, keyLength, data, inputSize));
		} else {
			printf("found key - %d, deciphered string is:\n%s\n", otherEncryptionKey, decipherWithKey(otherEncryptionKey, keyLength, data, inputSize));
		}
	}

	free(data);
	free(knownWordsString);

	MPI_Finalize();
	return 0;
}
