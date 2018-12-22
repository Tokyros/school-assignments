#ifndef SRC_KINDERGARDEN_H_
#define SRC_KINDERGARDEN_H_

#include <stdlib.h>
#include <stdio.h>

#include "child.h"
#include "utils.h"

enum KINDERGARDEN_TYPE {HOVA, TROM_HOVA, TROM_TROM_HOVA};


typedef struct {
	char* name;
	enum KINDERGARDEN_TYPE type;
	int childrenCount;
	Child** children;
} Kindergarden;

void printKindergarden(Kindergarden* kindergarden);
void writeKindergardenToFile(FILE* file, Kindergarden* kindergarden);
Kindergarden* readKindergardenFromFile(FILE* file);
void ReleaseKindergarden(Kindergarden* kindergarden);
Child* findChildById(Kindergarden* kindergarden, int id);
Kindergarden* getKindergardenWithName(char* name);

#endif
