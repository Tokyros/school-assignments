#ifndef __PROTOTYPE__
#define __PROTOTYPE__

typedef enum
{
	EXIT,
	READ_CITY,
	SHOW_CITY,
	SHOW_GARDEN,
	WRITE_CITY,
	ADD_GARDEN,
	ADD_CHILD,
	CHILD_BIRTHDAY,
	COUNT_GRADUATE,
	SORT,
	KINDERGARTEN_LINKEDLIST,
	NofOptions
} MenuOptions;

typedef enum
{
	SORT_GARDENS_BY_NAME,
	SORT_GARDENS_BY_TYPE_AND_COUNT,
	SORT_CHILDREN_BY_ID,
	NoOfSortOptions
} SortMenuOptions;

typedef unsigned char Byte;


int		menu();
int sortMenu();
char*	getStrExactLength(char* inpStr);
int		checkAllocation(const void* p);
void insertionSort(void* arr, int size, int typeSize, int (*comparator)(const void*, const void*));
void printStrings(char* str, ...);




#endif
