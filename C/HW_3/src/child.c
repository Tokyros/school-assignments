#include "child.h"

Child* getChildWithId(int id) {
	Child* child = malloc(sizeof(Child));
	child->id = id;
	printf("Enter child's age:\n");
	scanf("%d", &child->age);
	return child;
}

void printChild(Child* child) {
	int id = child->id;
	int age = child->age;

	printf("Child with ID: %d and age: %d\n", id, age);
}

void writeChildToFile(FILE* file, Child* child) {
	fprintf(file, "%d %d\n", child->id, child->age);
}

Child* readChildFromFile(FILE* file) {
	Child* child = malloc(sizeof(Child));
	fscanf(file, "%d %d\n", &(child->id), &(child->age));
	return child;
}

void ReleaseChild(Child* child) {
	free(child);
}
