#include <omp.h>
#include <mpi.h>
#include <stdlib.h>
#include <stdio.h>
#include "cudaFunctions.h"

#define MPI_THREAD_COUNT 4

int *readFile(FILE *file, int *size)
{
	int *fileData;

	fscanf(file, "%d\n", size);

	fileData = (int *)malloc(sizeof(int) * (*size));
	for (int i = 0; i < (*size); i++)
	{
		fscanf(file, "%d\n", &fileData[i]);
	}

	fclose(file);
	return fileData;
}

void OpenMPTask(int *data, int itemsToScan, int* histogram) {
	int i, j;
	int threadId;
	int singleThreadHistogram[MPI_THREAD_COUNT * INPUT_MAX_VALUE] = {0};

	// Compute histogram for each thread using its threadId
	#pragma omp parallel for private(threadId)
	for (i = 0; i < itemsToScan; i++) {
		threadId = omp_get_thread_num();
		singleThreadHistogram[data[i] + threadId * INPUT_MAX_VALUE]++;
	}
	
	// Combine the different histograms into one
	#pragma omp parallel for private(j)
	for (i = 0; i < INPUT_MAX_VALUE; i++) {
		for (j = 0; j < MPI_THREAD_COUNT; j++) {
			histogram[i] += singleThreadHistogram[j * INPUT_MAX_VALUE + i];
		}
	}
}

int main(int argc, char *argv[])
{
	int inputSize, currentProcess, processCount;
	int *data;
	MPI_Status mpiStatus;

	// MPI initialization
	MPI_Init(&argc, &argv);
	MPI_Comm_size(MPI_COMM_WORLD, &processCount);

	MPI_Comm_rank(MPI_COMM_WORLD, &currentProcess);

	// Slave process
	if (currentProcess == 1)
	{
		// Initialise data on slave process side
		MPI_Recv(&inputSize, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
		data = (int *)malloc(sizeof(int) * (inputSize / 2));
		MPI_Recv(data, inputSize / 2, MPI_INT, 0, 0, MPI_COMM_WORLD, &mpiStatus);
	}
	// Master process
	else
	{
		FILE *file = fopen("data.txt", "r");
		if (!file)
		{
			printf("Could not open data.txt\n");
			exit(0);
		}

		data = readFile(file, &inputSize);
		// Let the slave process know the size of the data
		MPI_Send(&inputSize, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);						 
		// Half of the data will be processed by slave process 
		MPI_Send(data + inputSize / 2, inputSize / 2, MPI_INT, 1, 0, MPI_COMM_WORLD);
	}

	int itemsPerTask = inputSize / MPI_THREAD_COUNT;
	int finalHistogram[INPUT_MAX_VALUE] = {0};

	// Each process gets 1/2 of the data, and devides it into 1/4 for each computing strategy
	// Compute 1/4 of the data via openMP
	OpenMPTask(data, itemsPerTask, finalHistogram);

	// Compute 1/4 of the data via CUDA
	int cudaResult = computeOnGPU(data + itemsPerTask, finalHistogram, itemsPerTask, INPUT_MAX_VALUE);

	// Check for errors in CUDA process
	if (cudaResult != 0)
		MPI_Abort(MPI_COMM_WORLD, __LINE__);

	// Slave process
	if (currentProcess)
	{
		MPI_Send(&finalHistogram[0], INPUT_MAX_VALUE, MPI_INT, 0, 0, MPI_COMM_WORLD);
	}
	// Master process
	else
	{
		int slaveProcessHistogram[INPUT_MAX_VALUE] = {0};
		MPI_Recv(&slaveProcessHistogram[0], INPUT_MAX_VALUE, MPI_INT, 1, 0, MPI_COMM_WORLD, &mpiStatus);

		// Combine the two halves from master and slave process
		for (int i = 0; i < INPUT_MAX_VALUE; i++)
		{
			finalHistogram[i] += slaveProcessHistogram[i];
		}

		// Print histogram to output
		for (int i = 0; i < INPUT_MAX_VALUE; i++)
		{
			printf("%d: %d\n", i, finalHistogram[i]);
		}
	}

	MPI_Finalize();
	return 0;
}
