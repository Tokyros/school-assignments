#include <mpi.h>
#include <stdio.h>
#include <omp.h>
#include <stdlib.h>
#include "myProto.h"

void countDigitViaOpenMP(int *countFromEachThread, int *data) {
	int i;
	int tid;
#pragma omp parallel for private(tid)
	for (i = 0; i < PART; i++) {
		tid = omp_get_thread_num();
		countFromEachThread[data[i] + tid * INPUT_MAX_VALUE]++;
	}
}

void uniteSameDigitsViaOpenMP(int thread_count, int *countFromEachThread, int *totalCount) {
	int i, j;
#pragma omp parallel for private(j)
	for (i = 0; i < INPUT_MAX_VALUE; i++) {
		for (j = 0; j < thread_count; j++) {
			totalCount[i] += countFromEachThread[j * INPUT_MAX_VALUE + i];
		}
	}
}
