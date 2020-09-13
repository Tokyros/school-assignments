#include <stdio.h>
#include <math.h>
#include <mpi.h>
#define HEAVY 100000
#define SHORT 1
#define LONG 10
#define N 20.0

typedef struct
{
    int from;
    int to;
} Task;

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

// Execute part of the computation
double calculateAnswer(int from, int to)
{
    int x, y;
    double answer = 0;
    for (x = from; x < to; x++)
        for (y = 0; y < N; y++)
            answer += heavy(x, y);
    return answer;
}

void distributeTasks(int proc_count)
{
    for (int procRank = 1; procRank < proc_count; procRank++)
    {
        // Distribute tasks evenly between processes (all except master)
        double workload = N / (proc_count - 1);
        Task task;
        task.from = (procRank - 1) * workload;
        task.to = procRank * workload;

        MPI_Send(&task, 2, MPI_INT, procRank, 0, MPI_COMM_WORLD);
    }
}

// Receive responses back from slaves
double collectTasks(int proc_count)
{
    double answer = 0;
    for (int i = 1; i < proc_count; i++)
    {
        double result;
        MPI_Recv(&result, 1, MPI_DOUBLE, i, MPI_ANY_TAG, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        answer += result;
    }
    return answer;
}

// Receive process task portion, execute it and send back the result
void performTask()
{
    Task task;
    // Receive the task from the master process
    MPI_Recv(&task, 2, MPI_INT, 0, MPI_ANY_TAG, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
    // Calculate the local value
    double localAnswers = calculateAnswer(task.from, task.to);
    // Send value back to master process
    MPI_Send(&localAnswers, 1, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD);
}

void handleMasterProcess(int proc_count)
{
    double start = MPI_Wtime();
    double answer = 0;
    // Send static tasks to slaves
    distributeTasks(proc_count);

    // receive answer back from tasks
    answer = collectTasks(proc_count);

    printf("answer = %fl\n", answer);
    printf("Static pool took %f seconds\n\n", MPI_Wtime() - start);
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
        printf("==========Running static pool==========\n");
        printf("Using %d running processes\n", proc_count);
        handleMasterProcess(proc_count);
    }
    else
    {
        performTask();
    }

    MPI_Finalize();
}