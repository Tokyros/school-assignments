Shahar Rosen - 204541791
Roy Gazit - 308575133

I have added a makefile to help run the different files

run `make` to build shearsort.c:

## Run with input from file
`make run_sort_file_input` or `mpirun -n 9 ./exec-shearsort in.txt`

## Run with input from terminal
`make run_sort_terminal_input` or `mpirun -n 9 ./exec-shearsort`
