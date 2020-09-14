#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <mpi.h>

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

void printMatrix(Triple* mat, int size) {
    for (int z = 0; z < size; z++)
    {
        printf("\t(%d, %d, %d)\t", mat[z].first,mat[z].second, mat[z].third);
        if ((z + 1) % 3 == 0)
        {
            printf("\n");
        }
    }
}

Triple *readMatrixFromInput(FILE *input, int *size)
{
    Triple *mat = malloc(sizeof(Triple));
    int i = 0;
    int first, second, third;

    while(fscanf(input, "%d %d %d $", &first, &second, &third) == 3 && !feof(input))
    {
        i++;
        mat = realloc(mat, (sizeof(Triple) * i));
        mat[i - 1] = (Triple){first, second, third};
        
    }

    *size = i;
    mat = realloc(mat, (i * sizeof(Triple)));

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

    Triple *mat;

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
                MPI_Abort(MPI_COMM_WORLD, 1);
            }
        }

        if (file == NULL) {
            printf("Enter your values as three numbers separated by white space\nafter each triplet there should be a $ sign\n");
            printf("To finish entering your input press control+d key combination\n");
        }

        mat = readMatrixFromInput(file == NULL ? stdin : file, &size);

        if ((int)sqrt(size) != sqrt(size))
        {
            printf("Number of items must be of the form n*n!\n");
            MPI_Abort(MPI_COMM_WORLD, 1);
        }

        printf("input matrix:\n");
        printMatrix(mat, size);
    }

    MPI_Bcast(&size, 1, MPI_INT, 0, MPI_COMM_WORLD);
    MPI_Comm comm = initCartisianComm(sqrt(size), rank, coords);

    MPI_Scatter(mat, 1, mpi_triple_datatype, &triple, 1, mpi_triple_datatype, 0, comm);

    shearSortMatrix(&triple, size, coords, comm, mpi_triple_datatype);

    MPI_Gather(&triple, 1, mpi_triple_datatype, mat, 1, mpi_triple_datatype, 0, comm);

    if (rank == 0)
    {
        printf("\noutput matrix:\n");
        printMatrix(mat, size);

        printf("\nSorted triplets:\n");
        for (int i = 0; i < sqrt(size); i++)
        {
            if (i % 2 == 0)
            {
                for (int z = 0; z < sqrt(size); z++)
                {
                    Triple oneTriple = mat[(i * (int)sqrt(size)) + z];
                    printf("(%d %d %d)\n", oneTriple.first, oneTriple.second, oneTriple.third);
                }
            } else {
                for (int z = sqrt(size) - 1; z >= 0; z--)
                {
                    Triple oneTriple = mat[(i * (int)sqrt(size)) + z];
                    printf("(%d %d %d)\n", oneTriple.first, oneTriple.second, oneTriple.third);
                }
            }
        }
        
    }

    MPI_Finalize();
}
