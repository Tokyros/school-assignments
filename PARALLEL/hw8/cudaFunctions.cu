#include <cuda_runtime.h>
#include <helper_cuda.h>
#include "myProto.h"

__global__ void countDigitViaCuda(int *data, int *countFromCUDA, int numPartElements) {
	int i = blockDim.x * blockIdx.x + threadIdx.x;

	if (i < numPartElements) {
		countFromCUDA[data[i] + i * INPUT_MAX_VALUE]++;
	}
}

__global__ void uniteSameDigitsViaCuda(int *countFromCUDA, int *totalCount, int numPartElements) {
	int i = blockDim.x * blockIdx.x + threadIdx.x;

	if (i < INPUT_MAX_VALUE) {
		for (int j = 0; j < PART; j++) {
			totalCount[i] += countFromCUDA[i + j * INPUT_MAX_VALUE];
		}
	}
}

int computeOnGPU(int *data, int *totalCount, int *countFromCUDA, int numPartElements, int rangeNumbers, int numberMultThreads){
	
	cudaError_t err = cudaSuccess; //Error code to check return values for CUDA calls

	//Define all size_t  
	size_t sizeNumberElements = numPartElements * sizeof(float);
	size_t sizeNumberRange = rangeNumbers * sizeof(float);
	size_t sizeNumberMultThreads = numberMultThreads * sizeof(float);

	//Allocate memory on GPU to copy the data from the host
	int *d_A;
	err = cudaMalloc((void**) &d_A, sizeNumberElements);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to allocate device memory - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Allocate memory on GPU to copy the data from the host
	int *d_B;
	err = cudaMalloc((void**) &d_B, sizeNumberRange);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to allocate device memory - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Allocate memory on GPU to copy the data from the host
	int *d_C;
	err = cudaMalloc((void**) &d_C, sizeNumberMultThreads);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to allocate device memory - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Copy data from host to the GPU memory
	err = cudaMemcpy(d_A, data, sizeNumberElements, cudaMemcpyHostToDevice);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to copy data from host to device - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Copy data from host to the GPU memory
	err = cudaMemcpy(d_B, totalCount, sizeNumberRange, cudaMemcpyHostToDevice);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to copy data from host to device - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Copy data from host to the GPU memory
	err = cudaMemcpy(d_C, countFromCUDA, sizeNumberMultThreads, cudaMemcpyHostToDevice);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to copy data from host to device - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Launch the Kernel to count Digit From Each Process
	int threadsPerBlock = 32;
	int blocksPerGrid = (numPartElements + threadsPerBlock - 1) / threadsPerBlock;
	countDigitViaCuda<<<blocksPerGrid, threadsPerBlock>>>(d_A, d_C, numPartElements);
	err = cudaGetLastError();
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to launch vectorAdd kernel -  %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Launch the Kernel to sum the solution from all the threads
	threadsPerBlock = 32;
	blocksPerGrid = (INPUT_MAX_VALUE + threadsPerBlock - 1) / threadsPerBlock;
	uniteSameDigitsViaCuda<<<blocksPerGrid, threadsPerBlock>>>(d_C, d_B, INPUT_MAX_VALUE);
	err = cudaGetLastError();
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to launch vectorAdd kernel -  %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Copy the result from GPU to the host memory.
	err = cudaMemcpy(data, d_A, sizeNumberElements, cudaMemcpyDeviceToHost);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to copy result array from device to host -%s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Copy the result from GPU to the host memory.
	err = cudaMemcpy(totalCount, d_B, sizeNumberRange, cudaMemcpyDeviceToHost);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to copy result array from device to host -%s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Copy the result from GPU to the host memory.
	err = cudaMemcpy(countFromCUDA, d_C, sizeNumberMultThreads,cudaMemcpyDeviceToHost);
	if (err != cudaSuccess) {
		fprintf(stderr, "Failed to copy result array from device to host -%s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Free allocated memory on GPU
	if (cudaFree(d_A) != cudaSuccess) {
		fprintf(stderr, "Failed to free device data - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Free allocated memory on GPU
	if (cudaFree(d_B) != cudaSuccess) {
		fprintf(stderr, "Failed to free device data - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	//Free allocated memory on GPU
	if (cudaFree(d_C) != cudaSuccess) {
		fprintf(stderr, "Failed to free device data - %s\n", cudaGetErrorString(err));
		exit(EXIT_FAILURE);
	}

	return 0;
}