#include <omp.h>
#include <mpi.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "cipher.h"
#include "cudaFunctions.h"

#define MPI_THREAD_COUNT 4

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
	char* binaryString = (char*) malloc(sizeof(char) * stringLength + 1);
	for (int c = 0; c < stringLength; c++) {
		binaryString[stringLength - c - 1] = num % 2 + '0';
		num /= 2;
	}

	return binaryString;
}

int isValidText(char *text, char *knownWords) {
	const char separator[2] = "\n";
	char *word;
	
	word = strtok(knownWords, separator);
	
	while( word != NULL ) {
		if (strstr(text, word) != NULL) {
			return 1;
		}
		word = strtok(NULL, separator);
	}
	return 0;
}

void OpenMPTask(char *data, int data_length, char *words, int fromKey, int toKey, int* key, int keyLen) {
	omp_set_num_threads(4);
	#pragma omp parallel for
	for (int i = fromKey; i < toKey; i++) {
		char* binaryString = numToBinaryString(i);
		printf("%s\n", binaryString);
		binaryStringToBinary(binaryString, keyLen);
		char* deciphered = cipherString(binaryString, keyLen, data, data_length);
		printf("%s\n", deciphered);
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
	int res;

	if (currentProcess == 1)
	{
		MPI_Recv(&inputSize, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&knownWordsLength, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		MPI_Recv(&keyOptions, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		
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

		MPI_Send(data, inputSize, MPI_CHAR, 1, 0, MPI_COMM_WORLD);
		MPI_Send(knownWordsString, knownWordsLength, MPI_CHAR, 1, 0, MPI_COMM_WORLD);
	}

	OpenMPTask(data, inputSize, knownWordsString, fromKey, toKey, &res, keyLength);

//
//	// Compute 1/4 of the data via CUDA
//	int cudaResult = computeOnGPU(data + itemsPerTask, finalHistogram, itemsPerTask, INPUT_MAX_VALUE);
//
//	// Check for errors in CUDA process
//	if (cudaResult != 0)
//		MPI_Abort(MPI_COMM_WORLD, __LINE__);
//
//	// Slave process
//	if (currentProcess)
//	{
//		MPI_Send(&finalHistogram[0], INPUT_MAX_VALUE, MPI_INT, 0, 0, MPI_COMM_WORLD);
//	}
//	// Master process
//	else
//	{
//		int slaveProcessHistogram[INPUT_MAX_VALUE] = {0};
//		MPI_Recv(&slaveProcessHistogram[0], INPUT_MAX_VALUE, MPI_INT, 1, 0, MPI_COMM_WORLD, &mpiStatus);
//
//		// Combine the two halves from master and slave process
//		for (int i = 0; i < INPUT_MAX_VALUE; i++)
//		{
//			finalHistogram[i] += slaveProcessHistogram[i];
//		}
//
//		// Print histogram to output
//		for (int i = 0; i < INPUT_MAX_VALUE; i++)
//		{
//			printf("%d: %d\n", i, finalHistogram[i]);
//		}
//	}

	MPI_Finalize();
	return 0;
}
