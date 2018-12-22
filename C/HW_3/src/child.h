
#ifndef SRC_CHILD_H_
#define SRC_CHILD_H_

#include <stdlib.h>
#include <stdio.h>

#include "utils.h"

typedef struct {
	int id;
	int age;
} Child;

void printChild(Child* child);
void writeChildToFile(FILE* file, Child* child);
Child* readChildFromFile(FILE* file);
Child* getChildWithId(int id);
void ReleaseChild(Child* child);


#endif

