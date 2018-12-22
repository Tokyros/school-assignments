#include "kindergarden.h"

char* GARDEN_TYPES_NAMES[] = {"HOVA", "TROM_HOVA", "TROM_TROM_HOVA"};

Child* findChildById(Kindergarden* kindergarden, int id) {
	int i;
	for (i = 0; i < kindergarden->childrenCount; i++) {
		if (kindergarden->children[i]->id == id) {
			return kindergarden->children[i];
		}
	}
	return NULL;
}

void printKindergarden(Kindergarden* kindergarden) {
	int i;
	printf("%s Kinder-Garden - %s, with %d kids:\n", kindergarden->name, GARDEN_TYPES_NAMES[kindergarden->type], kindergarden->childrenCount);
	for (i = 0; i < kindergarden->childrenCount; i++) {
		printChild(kindergarden->children[i]);
	}
}

Kindergarden* readKindergardenFromFile(FILE* file) {
	int i;
	Kindergarden* kindergarden = malloc(sizeof(Kindergarden));
	char c;
	int z = 0;

	kindergarden->name = malloc(z * sizeof(char));
	while ((c = fgetc(file)) != ' ') {
		kindergarden->name = realloc(kindergarden->name, (++z) * sizeof(char));
		kindergarden->name[z-1] = c;
	}
	kindergarden->name[z] = '\0';

	fscanf(file, "%d %d\n", &(kindergarden->type), &(kindergarden->childrenCount));
	kindergarden->children = malloc(sizeof(Child) * kindergarden->childrenCount);
	for (i = 0; i < kindergarden->childrenCount; i++) {
		kindergarden->children[i] = readChildFromFile(file);
	}
	return kindergarden;
}

void ReleaseKindergarden(Kindergarden* kindergarden) {
	int i;
	for (i = 0; i < kindergarden->childrenCount; i++) {
		ReleaseChild(kindergarden->children[i]);
	}
	free(kindergarden->name);
}

Kindergarden* getKindergardenWithName(char* name) {
	Kindergarden* newKindergarden = malloc(sizeof(Kindergarden));
	newKindergarden->name = name;
	newKindergarden->childrenCount = 0;
	newKindergarden->children = malloc(0);
	printf("What type of kindergarden?\n1. HOVA\n2. TROM_HOVA\n3. TROM_TROM_HOVA\n");
	scanf("%d", &newKindergarden->type);
	return newKindergarden;
}

void writeKindergardenToFile(FILE* file, Kindergarden* kindergarden) {
	int i;
	fprintf(file, "%s %d %d\n", kindergarden->name, kindergarden->type, kindergarden->childrenCount);
	for (i = 0; i < kindergarden->childrenCount; i++) {
		writeChildToFile(file, kindergarden->children[i]);
	}
}


