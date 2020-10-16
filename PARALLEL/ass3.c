
// Kernel
__global__
void generateHistogram(int n, float *input, float *histogram)
{
  __shared__ int blockHistogram[256];

  int myNum = threadIdx.x;
  for (int inputIdx = 0; inputIdx < n; inputIdx++) {
    if (input[inputIdx] == myNum) atomicAdd(&blockHistogram[myNum], 1.0f);
}
  atomicAdd(&histogram[myNum], blockHistogram[myNum]);
}

int main()
{
  // size of input
  int N = 10;
  float *input, *histogram, *dev_input, *dev_histogram;
  input = (float*)malloc(N*sizeof(float));
  histogram = (float*)malloc(256*sizeof(float));

  cudaMalloc(&dev_input, N*sizeof(float)); 
  cudaMalloc(&dev_histogram, 256*sizeof(float));

  for (int i = 0; i < N; i++) {
    // Read input into input array
    input[i] = i * 3; // temp
  }

  cudaMemcpy(dev_input, input, N*sizeof(float), cudaMemcpyHostToDevice);
  // not sure if needed...
  cudaMemcpy(dev_histogram, histogram, 256*sizeof(float), cudaMemcpyHostToDevice);

  // Perform SAXPY on 1M elements
  generateHistogram<<</*2 inputs per block?*/N / 2 + 1, 256>>>(N, dev_input, dev_histogram);

  cudaMemcpy(histogram, dev_histogram, 256*sizeof(float), cudaMemcpyDeviceToHost);

  // merge histogram with openMP histogram
  
  for (int i = 0; i < N; i++) {
      printf("Value of %d in the histogram is %d\n", input[i], histogram[input[i]]);
  }

  cudaFree(d_x);
  cudaFree(d_y);
  free(x);
  free(y);
}