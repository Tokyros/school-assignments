build:
	mpicxx -fopenmp -c simple_hash.c -o simple_hash.o
	mpicxx -fopenmp -c cipher.c -o cipher.o
	mpicxx -fopenmp -c main.c -o main.o
	nvcc -I./inc -c cudaFunctions.cu -o cudaFunctions.o
	mpicxx -fopenmp -o brute-force-encryption simple_hash.o cipher.o main.o cudaFunctions.o  /usr/local/cuda-9.1/lib64/libcudart_static.a -ldl -lrt

encrypt:
	./cipher 1010 4 -i ./text-files/input.txt -o ./text-files/encrypted.txt -b

clean:
	rm -f *.o ./brute-force-encryption

run:
	mpiexec -np 2 ./brute-force-encryption 4 ./text-files/encrypted.txt
