#ifndef __CHILD__
#define __CHILD__

#include <stdlib.h>

#include "General.h"


typedef struct
{
	int	 id;
	int  age;
}Child;


void	readChild(FILE* fp, Child* pChild);
void	getChildFromUser(Child* pChild, int id);
void	showChild(const Child* pChild);
void	writeChild(FILE* fp,const Child* pChild);
int		findChildById(Child** pChildList, int count, int id);
void	birthday(Child* pChild);
//void	releaseChild(Child* pChild);

Byte* childToBinary(Child* pChild);
Child* readChildFromBinaryFile(FILE* file);
void writeChildToBinaryFile(Child* child, FILE* file);

int compareChildByID(const void* a, const void* b);
void sortChildrenById(Child** children, int size);

#endif
