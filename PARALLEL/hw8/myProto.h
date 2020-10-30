#pragma once

#define FILE_NAME "data.txt"
#define MASTER 0
#define PART 2500
#define INPUT_MAX_VALUE 256

int computeOnGPU(int *data, int *totalCount, int *countFromCUDA, int numPartElements, int rangeNumbers, int numberMultThreads);
void countDigitViaOpenMP(int *countFromEachThread, int *data);
void uniteSameDigitsViaOpenMP(int threadCount, int *countFromEachThread, int *totalCount);
