pipes: main.c row col sub-mat
	gcc main.c -o pipes

row: validate_row.c
	gcc validate_row.c -o row

col: validate_col.c
	gcc validate_col.c -o col

sub-mat: validate_sub_matrices.c
	gcc validate_sub_matrices.c -o sub-mat

clean:
	rm pipes row col sub-mat