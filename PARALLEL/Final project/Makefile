build:
	mpicxx -fopenmp -c simple_hash.c -o simple_hash.o
	mpicxx -fopenmp -c utils.c -o utils.o
	mpicxx -fopenmp -c main.c -o main.o
	mpicxx -fopenmp -o brute-force-encryption simple_hash.o utils.o main.o -ldl -lrt

clean:
	rm -f *.o ./brute-force-encryption

run:
	mpiexec -np 2 ./brute-force-encryption 4 ./text-files/encrypted.txt
