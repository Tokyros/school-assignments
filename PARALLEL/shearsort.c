#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <mpi.h>

// #define size 3

typedef struct
{
    int first;
    int second;
    int third;
} Triple;

FILE *readFile(char *path)
{
    FILE *fp;

    fp = fopen(path, "r");
    if (fp == NULL)
    {
        exit(EXIT_FAILURE);
    }

    return fp;
}

Triple *readFromTerminal(FILE *input, int *size)
{
    Triple *mat = malloc(sizeof(Triple));
    int i = 0;
    int first, second, third;
    do
    {
        i++;
        mat = realloc(mat, (sizeof(Triple) * i));
        fscanf(input, "%d %d %d $", &first, &second, &third);
        printf("ABOUT TO REALLOC\n");
        mat[i - 1] = (Triple){first, second, third};
    } while (fgetc(input) != EOF);
    *size = i;
    return mat;
}

MPI_Comm initCartisianComm(int matDimension, int rank, int *coords)
{
    MPI_Comm comm;
    int dims[2], period[2], reorder;
    dims[0] = matDimension;
    dims[1] = matDimension;
    period[0] = 0;
    period[1] = 0;
    MPI_Cart_create(MPI_COMM_WORLD, 2, dims, period, 1, &comm);
    MPI_Cart_coords(comm, rank, 2, coords);
    return comm;
}

int compareTriples(Triple a, Triple b)
{
    if (a.first > b.first)
    {
        return 1;
    }
    else if (a.first == b.first && a.second > b.second)
    {
        return 1;
    }
    else if (a.second == b.second && a.third > b.third)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

void sortRows(Triple *triple, int matSize, int *coords, MPI_Comm comm, MPI_Datatype mpi_triple_datatype)
{
    int leftTripleRank, rightTripleRank;
    MPI_Status status;
    Triple partnerTriple;

    MPI_Cart_shift(comm, 1, 1, &leftTripleRank, &rightTripleRank);
    int isEvenRow = coords[0] % 2 == 0;
    int isEvenColumn = coords[1] % 2 == 0;

    for (int i = 0; i < matSize; i++)
    {
        int evenComparesWithNeighbour = i % 2 == 0;

        int isActiveTriple = isEvenColumn ? evenComparesWithNeighbour : !evenComparesWithNeighbour;

        int partner = isActiveTriple ? rightTripleRank : leftTripleRank;

        if (partner < 0 || partner >= matSize * matSize)
        {
            continue;
        }

        MPI_Sendrecv(triple, 1, mpi_triple_datatype, partner, 0, &partnerTriple, 1, mpi_triple_datatype, partner, 0, MPI_COMM_WORLD, &status);
        int isBigger = compareTriples(*triple, partnerTriple);
        if (isActiveTriple)
        {
            if (isEvenRow)
            {
                if (isBigger)
                {
                    *triple = partnerTriple;
                }
            }
            else
            {
                if (!isBigger)
                {
                    *triple = partnerTriple;
                }
            }
        }
        else
        {
            if (isEvenRow)
            {
                if (!isBigger)
                {
                    *triple = partnerTriple;
                }
            }
            else
            {
                if (isBigger)
                {
                    *triple = partnerTriple;
                }
            }
        }
    }
}

void sortCols(Triple *triple, int matSize, int *coords, MPI_Comm comm, MPI_Datatype mpi_triple_datatype)
{
    int leftTripleRank, rightTripleRank;
    MPI_Status status;
    Triple partnerTriple;

    MPI_Cart_shift(comm, 0, 1, &leftTripleRank, &rightTripleRank);

    for (int i = 0; i < matSize; i++)
    {
        int evenComparesWithNeighbour = i % 2 == 0;
        int isEven = coords[0] % 2 == 0;

        int isActiveTriple = isEven ? evenComparesWithNeighbour : !evenComparesWithNeighbour;

        int partner = isActiveTriple ? rightTripleRank : leftTripleRank;

        if (partner < 0 || partner >= matSize * matSize)
        {
            continue;
        }

        MPI_Sendrecv(triple, 1, mpi_triple_datatype, partner, 0, &partnerTriple, 1, mpi_triple_datatype, partner, 0, MPI_COMM_WORLD, &status);
        int isBigger = compareTriples(*triple, partnerTriple);
        if (isActiveTriple && isBigger)
        {
            *triple = partnerTriple;
        }
        else if (!isActiveTriple && !isBigger)
        {
            *triple = partnerTriple;
        }
    }
}

void shearSortMatrix(Triple *triple, int size, int *coords, MPI_Comm comm, MPI_Datatype mpi_triple_datatype)
{
    int interation_limit = ceil(log2(size)) + 1;
    for (int i = 0; i < interation_limit; i++)
    {
        sortRows(triple, size, coords, comm, mpi_triple_datatype);
        sortCols(triple, size, coords, comm, mpi_triple_datatype);
    }
}

int main(int argc, char *argv[])
{
    MPI_Init(NULL, NULL);

    int proc_count;
    MPI_Comm_size(MPI_COMM_WORLD, &proc_count);

    int rank;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    int coords[2];
    Triple triple;

    MPI_Datatype mpi_triple_datatype;

    MPI_Aint displacements[3];
    displacements[0] = (char *)&triple.first - (char *)&triple;
    displacements[1] = (char *)&triple.second - (char *)&triple;
    displacements[2] = (char *)&triple.third - (char *)&triple;

    MPI_Datatype types[3] = {MPI_INT, MPI_INT, MPI_INT};
    int block_lengths[3] = {1, 1, 1};

    MPI_Type_create_struct(3, block_lengths, displacements, types, &mpi_triple_datatype);
    MPI_Type_commit(&mpi_triple_datatype);

    if (argc > 1)
    {
        // ... read file
    }
    else
    {
        // ... read from STDIO
    }

    Triple *mat;
    // Triple mat[size][size] = {
    //     {(Triple){1, 2, 3}, (Triple){10, 11, 12}, (Triple){13, 14, 15}},
    //     {(Triple){7, 8, 9}, (Triple){4, 5, 6}, (Triple){16, 17, 18}},
    //     {(Triple){19, 20, 21}, (Triple){22, 23, 24}, (Triple){25, 26, 27}},
    // };

    int size;
    if (rank == 0)
    {
        FILE *file = NULL;
        if (argc > 1)
        {
            file = fopen(argv[1], "r");
            if (file == NULL)
            {
                printf("Couldn't read input file\n");
            }
        }
        mat = readFromTerminal(file == NULL ? stdin : file, &size);
        // read from file
        printf("%d\n", size);
        if ((int)sqrt(size) != sqrt(size))
        {
            printf("Number of items must be of the form n*n!\n");
            MPI_Abort(MPI_COMM_WORLD, 1);
        }
    }

    MPI_Bcast(&size, 1, MPI_INT, 0, MPI_COMM_WORLD);
    MPI_Comm comm = initCartisianComm(sqrt(size), rank, coords);

    MPI_Scatter(mat, 1, mpi_triple_datatype, &triple, 1, mpi_triple_datatype, 0, comm);

    shearSortMatrix(&triple, size, coords, comm, mpi_triple_datatype);

    MPI_Gather(&triple, 1, mpi_triple_datatype, mat, 1, mpi_triple_datatype, 0, comm);

    if (rank == 0)
    {
        for (int i = 0; i < sqrt(size); i++)
        {
            if (i % 2 == 0)
            {
                for (int z = 0; z < sqrt(size); z++)
                {
                    Triple oneTriple = mat[i + z];
                    printf("even: (%d %d %d)\n", oneTriple.first, oneTriple.second, oneTriple.third);
                }
            } else {
                for (int z = sqrt(size) - 1; z >= 0; z--)
                {
                    Triple oneTriple = mat[i + z];
                    printf("odd: (%d %d %d)\n", oneTriple.first, oneTriple.second, oneTriple.third);
                }
            }
        }

        for (int i = 0; i < size; i++)
        {
            Triple oneTriple = mat[i];
            printf("odd: (%d %d %d)\n", oneTriple.first, oneTriple.second, oneTriple.third);
        }
        
    }

    MPI_Finalize();
}

// Cube* readFromFile(Cube* table, int* tableSize){
// 	int size = 0;
// 	FILE* file;
// 	file = fopen("cuboids.dat","r");
// 	table = (Cube*)malloc(size * sizeof(Cube));

// 	if(file == NULL){
// 		printf("Error ! could not open file\n");
// 		exit(-1);
// 	}

// 	do{
// 		size++;
// 		table = (Cube*)realloc(table, size * sizeof(Cube));
// 		fscanf(file, "%d %f %f %f", &(table[size-1].id), &(table[size-1]).length, &(table[size-1].width), &(table[size-1].height));
// 		table[size-1].volume = table[size-1].length * table[size-1].width * table[size-1].height;
// 	}while(fgetc(file) != EOF);

// 	fflush(stdout);
// 	*tableSize = size;
// 	fclose(file);
// 	return table;
// }

// void writeToFile(Cube* table, int tableSize){
// 	int i,j,size;
// 	FILE* file;
// 	file = fopen("result.dat", "w+");
// 	if(file == NULL){
// 		printf("Error! could not open file\n");
// 		exit(-1);
// 	}
// 	size = (int)sqrt(tableSize);

// 	for(i = 0; i < size; i++){// Go Through All Rows

// 		if(i % 2 == 0){ //Even Row - Left To Right
// 			for(j = 0; j< size; j++){
// 				fprintf(file, "%d ", table[size*i+j].id);
// 			}
// 		}else{ // Odd Row - Right To Left
// 			for(j = size - 1; j >= 0; j--){
// 				fprintf(file, "%d ", table[size*i+j].id);
// 			}
// 		}
// 	}
// 	fclose(file);
// }