I have added a makefile to help run the different files

run `make` to build all three files, then to run the files:

## Run sequential
`mpirun -n 1 ./exec-sequential`

## Run static
`mpirun -n 5 ./exec-static`

## Run dynamic
`mpirun -n 5 ./exec-dynamic`
