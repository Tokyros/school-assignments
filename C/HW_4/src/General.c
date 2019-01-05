#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include "General.h"


const char* optionStr[NofOptions] =
{
	"Exit","Read City information from file",
	"Show all Kindergartens","Show a specific Kindergarten",
	"Save City information to file","Add a Kindergarten",
	"Add a Child","Birthday to a Child",
	"Count Hova childres",
	"Sort city entities",
	"Test kindergarten linked list",
};

const char* sortOptionStr[NoOfSortOptions] =
{
	"Sort kindergartens by name",
	"Sort kindergartens by type and count",
	"Sort children by ID",
};


/**************************************************/
int menu()
/**************************************************/
/**************************************************/
{
	int option,i;

	printf("\n==========================");
	printf("\nSelect:\n");
	for(i = 0 ; i < NofOptions; i++)
		printf("\n\t%d. %s.",i, optionStr[i]);
	printf("\n");
	scanf("%d", &option);
	return option;
}

int sortMenu() {
	int option,i;

	printf("\n==========================");
	printf("\nSelect:\n");
	for(i = 0 ; i < NoOfSortOptions; i++)
		printf("\n\t%d. %s.",i, sortOptionStr[i]);
	printf("\n");
	scanf("%d", &option);
	return option;
}

char* getStrExactLength(char* inpStr)
{
	char* theStr = NULL;
	size_t len;

	len = strlen(inpStr) + 1;
	//allocate a place for the string in the right location in the array 
	theStr = (char*)malloc(len*sizeof(char));
	//Copy the string to the right location in the array 
	if (theStr != NULL)
		strcpy(theStr, inpStr);

	return theStr;
}

int checkAllocation(const void* p)
{
	if (!p)
	{
		printf("ERROR! Not enough memory!");
		return 0;
	}
	return 1;
}

void insertionSort(void* arr, int size, int typeSize, int (*comparator)(const void*, const void*))
{
	printf("%d\n", size);
	int i,j;
	char* key = malloc(typeSize);
	char* array = (char*) arr;

	for (i = 1; i < size; i++)
	{
		memcpy(key, array + i*typeSize, typeSize);

		for (j = i - 1; j >= 0 && (comparator(array + j*typeSize, key) > 0); j--) {
			memcpy(array + (j+1)*typeSize, array + j*typeSize, typeSize);
		}

		memmove((array + (j+1)*typeSize), key, typeSize);
	}

	free(key);
}

void printStrings(char* str, ...) {
	int currentLength;
	char* currentStr = str;

	va_list args;
	va_start(args, str);

	while (currentStr) {
		currentLength = va_arg(args, int);
		printf("String: %s, Number: %d\n", currentStr, currentLength);
		currentStr = va_arg(args, char*);
	}

	va_end(args);
}

