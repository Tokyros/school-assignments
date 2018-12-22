#include "city.h"

void readCity(City* city) {
	FILE* file = fopen("DataFile.txt", "r");
	int i;
	if (file == NULL) {
		printf("Error opening file");
		return;
	}

	fscanf(file, "%d\n", &city->kindergardernsCount);
	city->kindergardens = malloc(sizeof(Kindergarden) * city->kindergardernsCount);
	for (i = 0; i < city->kindergardernsCount; i++) {
		city->kindergardens[i] = readKindergardenFromFile(file);
	}

	fclose(file);
}

void showCityGardens(City* city) {
	int i;
	for (i = 0; i < city->kindergardernsCount; i++) {
		printKindergarden(city->kindergardens[i]);
	}
}

void showSpecificGardenInCity(City* city) {
	char* gardenName;
	Kindergarden* kindergarden;

	printf("Which garden would you like to know about?\n");

	gardenName = readDynamicString();

	kindergarden = findKindergardenByName(city, gardenName);

	if (kindergarden == NULL) {
		printf("Could not find a matching kindergarden\n");
	} else {
		printKindergarden(kindergarden);
	}

	free(gardenName);
}

void saveCity(City* city) {
	int i;
	FILE* file = fopen("DataFile.txt", "w");
	if (file == NULL) {
		printf("Error opening file");
		return;
	}

	fprintf(file, "%d\n", city->kindergardernsCount);
	for (i = 0; i < city->kindergardernsCount; i++) {
		writeKindergardenToFile(file, city->kindergardens[i]);
	}

	fclose(file);
}

Kindergarden* findKindergardenByName(City* city, char* gardenName) {
	int i;
	for (i = 0; i < city->kindergardernsCount; i++) {
		if (strcmp(city->kindergardens[i]->name, gardenName) == 0) {
			return city->kindergardens[i];
		}
	}
	return NULL;
}

void cityAddGarden(City* city) {
	char* newGardenName;
	Kindergarden* kindergarden;
	printf("Enter new garden name\n");

	newGardenName = readDynamicString();
	kindergarden = findKindergardenByName(city, newGardenName);

	if (kindergarden == NULL) {
		city->kindergardens = realloc(city->kindergardens, (city->kindergardernsCount + 1) * sizeof(Kindergarden));
		city->kindergardens[city->kindergardernsCount++] = getKindergardenWithName(newGardenName);
	} else {
		printf("Kindergarden with name %s allready exists\n", newGardenName);
	}

	free(newGardenName);
}

void addChildToSpecificGardenInCity(City* city) {
	char* gardenName;
	int id;
	Kindergarden* kindergarden;
	printf("What garden would you like to add a kid to?\n");
	gardenName = readDynamicString();

	kindergarden = findKindergardenByName(city, gardenName);
	if(kindergarden == NULL) {
		printf("Could not find a garden with that name\n");
	} else {
		printf("Enter child's ID:\n");
		scanf("%d", &id);
		if (findChildById(kindergarden, id) != NULL) {
			printf("A child with this ID already exist\n");
			return;
		}
		kindergarden->children = realloc(kindergarden->children, (kindergarden->childrenCount + 1) * sizeof(Child));
		kindergarden->children[kindergarden->childrenCount++] = getChildWithId(id);
	}

	free(gardenName);
}


void birthdayToChild(City* city) {
	char* gardenName;
	int childId;
	Kindergarden* kindergarden;
	Child* child;

	printf("Enter name for kindergarden:\n");
	gardenName = readDynamicString();
	kindergarden = findKindergardenByName(city, gardenName);
	if (gardenName == NULL) {
		printf("Coulnd't find a matching kindergarden\n");
	} else {
		printf("Enter child's ID\n");
		scanf("%d", &childId);
		child = findChildById(kindergarden, childId);
		if (child == NULL) {
			printf("Cound't find a kid with that ID\n");
		} else {
			child->age++;
		}
	}
}


int countChova(City* city) {
	int i;
	int count = 0;
	for (i = 0; i < city->kindergardernsCount; i++) {
		if (city->kindergardens[i]->type == HOVA) {
			count += city->kindergardens[i]->childrenCount;
		}
	}
	return count;
}


void ReleaseCity(City* city) {
	int i;
	for (i = 0; i < city->kindergardernsCount; i++) {
		free(city->kindergardens[i]);
	}
}
