#include <stdio.h>
#include <math.h>
#include <mpi.h>
#define HEAVY 100000
#define SHORT 1
#define LONG 10
#define N 20.0

enum ranks
{
    ROOT,
    WORK_TAG = 0,
    END_TAG = 1
};

// This function performs heavy computations,
// its run time depends on x and y values
double heavy(int x, int y)
{
    int i, loop = SHORT;
    double sum = 0;

    // Super heavy tasks
    if (x < 3 || y < 3)
        loop = LONG;
    // Heavy calculations
    for (i = 0; i < loop * HEAVY; i++)
        sum += cos(exp(sin((double)i / HEAVY)));
    return sum;
}

double calculateAnswer(int x)
{
    int y;
    double answer = 0;
    for (y = 0; y < N; y++)
        answer += heavy(x, y);
    return answer;
}

void performTask()
{
    int tag, task;
    double answer = 0;
    MPI_Status status;
    do
    {
        // Wait for task from master process
        MPI_Recv(&task, 1, MPI_INT, ROOT, MPI_ANY_TAG, MPI_COMM_WORLD, &status);

        // Tag is needed to know if process should wait for another task
        tag = status.MPI_TAG;

        answer = calculateAnswer(task);
        
        // Send back the result
        MPI_Send(&answer, 1, MPI_DOUBLE, ROOT, tag, MPI_COMM_WORLD);
    } while (tag != END_TAG);
}

void handleMasterProcess(int num_procs)
{
    MPI_Status status;
    int proc_rank;
    int current_task = 0;
    int total_jobs = N;
    double answer = 0;
    int source, tag;
    double localResult;
    double start = MPI_Wtime();

    // Distribute tasks to all available slaves
    for (current_task = 0; current_task < total_jobs && current_task < num_procs - 1; current_task++)
    {
        MPI_Send(&current_task, 1, MPI_INT, current_task + 1, WORK_TAG, MPI_COMM_WORLD);
    }

    // Wait for busy slaves to be available, then send another task, until all tasks are distributed
    for (; current_task < total_jobs; current_task++)
    {
        MPI_Recv(&localResult, 1, MPI_DOUBLE, MPI_ANY_SOURCE, WORK_TAG, MPI_COMM_WORLD, &status);
        answer += localResult;
        MPI_Send(&current_task, 1, MPI_INT, status.MPI_SOURCE, WORK_TAG, MPI_COMM_WORLD);
    }

    // Terminate all slave processes
    for (proc_rank = 1; proc_rank < num_procs; proc_rank++)
    {
        MPI_Send(&current_task, 1, MPI_INT, proc_rank, END_TAG, MPI_COMM_WORLD);
    }

    // Receive final results from terminated processes
    for (proc_rank = 1; proc_rank < num_procs; proc_rank++)
    {
        MPI_Recv(&localResult, 1, MPI_DOUBLE, MPI_ANY_SOURCE, END_TAG, MPI_COMM_WORLD, &status);
        answer += localResult;
    }

    printf("answer = %fl\n", answer);
    printf("Dynamic pool took %f seconds\n\n", MPI_Wtime() - start);
}

int main(int argc, char *argv[])
{
    MPI_Init(NULL, NULL);

    int proc_count;
    MPI_Comm_size(MPI_COMM_WORLD, &proc_count);

    int rank;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    if (rank == 0)
    {
        printf("==========Running dynamic pool==========\n");
        printf("Using %d running processes\n", proc_count);
        handleMasterProcess(proc_count);
    }
    else
    {
        performTask();
    }

    MPI_Finalize();
}