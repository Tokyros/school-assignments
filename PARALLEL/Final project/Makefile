build:
	mpicxx -fopenmp -c simple_hash.c -o simple_hash.o
	mpicxx -fopenmp -c cipher.c -o cipher.o
	mpicxx -fopenmp -c main.c -o main.o
	nvcc -I./inc -c cudaFunctions.cu -o cudaFunctions.o
	mpicxx -fopenmp -o histogram simple_hash.o cipher.o main.o cudaFunctions.o  /usr/local/cuda-9.1/lib64/libcudart_static.a -ldl -lrt

clean:
	rm -f *.o ./histogram

run:
	mpiexec -np 2 ./histogram 4 enc.txt
