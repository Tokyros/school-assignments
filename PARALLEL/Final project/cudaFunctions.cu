#include <cuda_runtime.h>
#include <helper_cuda.h>
#include "cudaFunctions.h"

__global__ void generateHistograms(int *data, int *hist, int maxIndexToProcess) {
	int i = blockDim.x * blockIdx.x + threadIdx.x;

	// Handle task overflow
	if (i < maxIndexToProcess) {
		// Increment the current value in the thread's histogram
		hist[data[i] + i * INPUT_MAX_VALUE]++;
	}
}

__global__ void combineHistograms(int *from, int *to, int dataToProceess) {
	int i = blockDim.x * blockIdx.x + threadIdx.x;

	// Handle task overflow
	if (i < INPUT_MAX_VALUE) {
		// Collect the histograms of each thread into the final histogram
		for (int j = 0; j < dataToProceess; j++) {
			to[i] += from[i + j * INPUT_MAX_VALUE];
		}
	}
}

int computeOnGPU(int *data, int *totalCount, int elementsToProcess, int numberMultThreads){
	
	int CUDAHist[INPUT_MAX_VALUE * elementsToProcess] = {0};

	// Transfare data to GPU
	int *device_data;
	size_t sizeNumberElements = elementsToProcess * sizeof(float);
	cudaMalloc((void**) &device_data, sizeNumberElements);
	cudaMemcpy(device_data, data, sizeNumberElements, cudaMemcpyHostToDevice);
	
	int *device_hist_result;
	size_t sizeNumberRange = INPUT_MAX_VALUE * sizeof(float);
	cudaMalloc((void**) &device_hist_result, sizeNumberRange);
	cudaMemcpy(device_hist_result, totalCount, sizeNumberRange, cudaMemcpyHostToDevice);
	
	int *device_hist_per_thread;
	size_t sizeNumberMultThreads = INPUT_MAX_VALUE * elementsToProcess * sizeof(float);
	cudaMalloc((void**) &device_hist_per_thread, sizeNumberMultThreads);
	cudaMemcpy(device_hist_per_thread, CUDAHist, sizeNumberMultThreads, cudaMemcpyHostToDevice);

	// Generate the histograms per thread
	int threadsPerBlock = 32;
	int blocksPerGrid = (elementsToProcess + threadsPerBlock - 1) / threadsPerBlock;
	generateHistograms<<<blocksPerGrid, threadsPerBlock>>>(device_data, device_hist_per_thread, elementsToProcess);

	// Combine the histograms from each thread into the final result
	threadsPerBlock = 32;
	blocksPerGrid = (INPUT_MAX_VALUE + threadsPerBlock - 1) / threadsPerBlock;
	combineHistograms<<<blocksPerGrid, threadsPerBlock>>>(device_hist_per_thread, device_hist_result, elementsToProcess);

	// Copt data back to host
	cudaMemcpy(data, device_data, sizeNumberElements, cudaMemcpyDeviceToHost);
	cudaMemcpy(totalCount, device_hist_result, sizeNumberRange, cudaMemcpyDeviceToHost);
	cudaMemcpy(CUDAHist, device_hist_per_thread, sizeNumberMultThreads,cudaMemcpyDeviceToHost);

	// Free memory
	cudaFree(device_data);
	cudaFree(device_hist_result);
	cudaFree(device_hist_per_thread);

	return 0;
}