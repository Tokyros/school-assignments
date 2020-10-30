build:
	mpicxx -fopenmp -c main.c -o main.o
	nvcc -I./inc -c cudaFunctions.cu -o cudaFunctions.o
	mpicxx -fopenmp -o histogram  main.o cudaFunctions.o  /usr/local/cuda-9.1/lib64/libcudart_static.a -ldl -lrt

clean:
	rm -f *.o ./histogram

run:
	mpiexec -np 2 ./histogram
