#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "Child.h"
#include "General.h"


/**************************************************/
/*             Read a Child from a file           */
/**************************************************/
void readChild(FILE* fp, Child* pChild)
{
	//Child ID
	fscanf(fp, "%d", &pChild->id);
	fscanf(fp, "%d", &pChild->age);
}


/**************************************************/
/*            show a Child				           */
/**************************************************/
void showChild(const Child* pChild)
{
	printf("\nID:%d  ", pChild->id);
	printf("Age:%d  ", pChild->age);
}


/**************************************************/
void getChildFromUser(Child* pChild, int id)
/**************************************************/
/**************************************************/
{
	pChild->id = id;
	
	puts("\nAge:\t");
	scanf("%d", &pChild->age);
}


/**************************************************/
/*Write a Child to the open file				*/
/**************************************************/
void writeChild(FILE* fp,const Child* pChild)
{
	fprintf(fp,"%d %d\n",pChild->id, pChild->age);
}

//linear search
int	findChildById(Child** pChildList, int count, int id)
{
	// Mocking a child struct with the id we search for so we can use `compareChildByID`
	Child mockChild = {id};
	Child* mockChildPtr = &mockChild;
	qsort(pChildList, count, sizeof(Child*), compareChildByID);

	Child** result = (Child**) bsearch(&mockChildPtr, pChildList, count, sizeof(Child*), compareChildByID);
	if (result) {
		return pChildList - result;
	} else {
		return -1;
	}
}

void birthday(Child* pChild)
{
	pChild->age++;
}


// Binary conversion

Byte* childToBinary(Child* pChild) {
	Byte* res = malloc(sizeof(Byte) * 2);
	res[0] = pChild->id & 0xFF;
	res[1] = (pChild->age << 5) | ((pChild->id >> 8) & 0x1F);
	return res;
}

void writeChildToBinaryFile(Child* child, FILE* file) {
	if (!file) {
		printf("Could not write child to binary file\n");
		return;
	}

	Byte* childBytes = childToBinary(child);
	fwrite(childBytes, sizeof(Byte) * 2, 1, file);
	free(childBytes);
}

Child* readChildFromBinaryFile(FILE* file) {
	if (!file) {
		return NULL;
	}

	Byte childBytes[2];
	fread(childBytes, sizeof(Byte), 2, file);

	int age = (childBytes[1] >> 5) & 0x7;
	int id = ((childBytes[1] & 0x1F) << 8) | childBytes[0];

	Child* child = malloc(sizeof(Child));
	child->age = age;
	child->id = id;

	return child;
}

void sortChildrenById(Child** children, int size) {
	insertionSort(children, size, sizeof(Child*), compareChildByID);
}

int compareChildByID(const void* a, const void* b) {
	Child* childA = *((Child**) a);
	Child* childB = *((Child**) b);

	if (childA->id > childB->id) {
		return 1;
	} else if (childA->id < childB->id) {
		return -1;
	} else {
		return 0;
	}
}

//void	releaseChild(Child* pChild)
//{
//	//nothing to release
//}
