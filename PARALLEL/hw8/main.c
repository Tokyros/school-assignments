#include <mpi.h>
#include <stdio.h>
#include <omp.h>
#include <stdlib.h>
#include "myProto.h"

#define MPI_THREAD_COUNT 4

int *readFile(FILE *file, int *size)
{
	int *fileData;

	fscanf(file, "%d\n", size);

	fileData = (int *)malloc(sizeof(int) * (*size));
	for (int i = 0; i < (*size); i++) {
		fscanf(file, "%d\n", &fileData[i]);
	}

	fclose(file);
	return fileData;
}

int main(int argc, char *argv[])
{
	int inputSize, currentProcess, processCount;
	int *data;
	MPI_Status mpiStatus;

	// Each thread gets INPUT_MAX_VALUE entries in the array, one for each possible input value
	int openMPHist[MPI_THREAD_COUNT * INPUT_MAX_VALUE] = {0};
	int CUDAHist[INPUT_MAX_VALUE * PART] = {0};

	int totalCount[INPUT_MAX_VALUE] = {0};
	int totalCountCUDA[INPUT_MAX_VALUE] = {0};

	MPI_Init(&argc, &argv);
	MPI_Comm_size(MPI_COMM_WORLD, &processCount);

	MPI_Comm_rank(MPI_COMM_WORLD, &currentProcess);

	//Divide the tasks between 2 processes
	if (currentProcess == MASTER)
	{
		FILE *file = fopen("data.txt", "r");
		if (!file)
		{
			printf("Could not open data.txt\n");
			exit(0);
		}

		data = readFile(file, &inputSize);
		MPI_Send(&inputSize, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);						  //Sending the inputSize to process 1
		MPI_Send(data + inputSize / 2, inputSize / 2, MPI_INT, 1, 0, MPI_COMM_WORLD); //Sending half of the data to process 1
	}

	else if (currentProcess == 1)
	{
		MPI_Recv(&inputSize, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus); //get the inputSize
		data = (int *)malloc(sizeof(int) * (inputSize / 2));
		MPI_Recv(data, inputSize / 2, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus); //get half of the data
	}

	//On each process (0 and 1) - perform the first half of the task via OpenMP
	countDigitViaOpenMP(openMPHist, data);
	uniteSameDigitsViaOpenMP(MPI_THREAD_COUNT, openMPHist, totalCount);

	//On each process (0 and 1) - perform the second half of ths task via CUDA
	if (computeOnGPU(data + PART, totalCount, CUDAHist, PART, INPUT_MAX_VALUE, INPUT_MAX_VALUE * PART) != 0)
		MPI_Abort(MPI_COMM_WORLD, __LINE__);

	// Slave process
	if (currentProcess)
	{
		MPI_Send(&totalCount[0], INPUT_MAX_VALUE, MPI_INT, 0, 0, MPI_COMM_WORLD);
	}
	// Master process
	else
	{
		MPI_Recv(&totalCountCUDA[0], INPUT_MAX_VALUE, MPI_INT, 1, 0, MPI_COMM_WORLD, &mpiStatus);

		//collect the totalCount from process 1
		for (int i = 0; i < INPUT_MAX_VALUE; i++)
		{
			totalCount[i] += totalCountCUDA[i];
		}

		printf("The result of histogram: \n\n");
		for (int i = 0; i < INPUT_MAX_VALUE; i++)
		{
			printf("%d: %d\n", i, totalCount[i]);
		}
	}

	MPI_Finalize();
	return 0;
}
