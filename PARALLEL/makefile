build:
	mpicc -c static.c dynamic.c sequential.c shearsort.c
	mpicc -o exec-static static.o
	mpicc -o exec-dynamic dynamic.o
	mpicc -o exec-sequential sequential.o
	mpicc -o exec-shearsort shearsort.o

run_sort:
	mpirun -n 4 ./exec-shearsort

run5:
	mpirun -n 1 ./exec-sequential
	mpirun -n 5 ./exec-static
	mpirun -n 5 ./exec-dynamic

clean:
	rm *.o exec-*
