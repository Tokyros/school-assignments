build:
	mpicc -c shearsort.c
	mpicc -o exec-shearsort shearsort.o

run_sort_terminal_input:
	mpirun -n 9 ./exec-shearsort

run_sort_file_input:
	mpirun -n 9 ./exec-shearsort in.txt

clean:
	rm *.o exec-*
