v1: pipes.c row col sub-mat
	gcc pipes.c -o v1

v2: mmap.c
	gcc mmap.c -o v2

pipes: main.c row col sub-mat
	gcc main.c -o pipes

row: validate_row.c
	gcc validate_row.c -o row

col: validate_col.c
	gcc validate_col.c -o col

sub-mat: validate_sub_matrices.c
	gcc validate_sub_matrices.c -o sub-mat

clean:
	rm v1 v2 row col sub-mat