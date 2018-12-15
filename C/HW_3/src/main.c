#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define READ_CITY 1
#define SHOW_CITY 2
#define SHOW_GARDEN 3
#define WRITE_CITY 4
#define ADD_GARDEN 5
#define ADD_CHILD 6
#define CHILD_BIRTHDAY 7
#define COUNT_GRADUATE 8
#define EXIT 0


enum KINDERGARDEN_TYPE {HOVA, TROM_HOVA, TROM_TROM_HOVA};
char* TYPES[] = {"HOVA", "TROM_HOVA", "TROM_TROM_HOVA"};

char* MENU = "Select:\n1. Read city information from file.\n2. Show all kindergardens.\n3. Show a specific kindergarden.\n4. Save city information to file\n5. Add a kindergarden\n6. Add a child\n7. Birthday to a child\n8. Count hova children\n0. EXIT.\n";

typedef struct {
	int id;
	int age;
} Child;

typedef struct {
	char* name;
	enum KINDERGARDEN_TYPE type;
	int childrenCount;
	Child** children;
} Kindergarden;

typedef struct {
	Kindergarden** kindergardens;
	int kindergardernsCount;
} City;

void printChild(Child* child);
void readCity(City* city);
void showCityGardens(City* city);
void writeChildToFile(FILE* file, Child* child);
Child* readChildFromFile(FILE* file);
void printKindergarden(Kindergarden* kindergarden);
void writeKindergardenToFile(FILE* file, Kindergarden* kindergarden);
Kindergarden* readKindergardenFromFile(FILE* file);
void showCityGardens(City* city);
void showSpecificGardenInCity(City* city);
char* readDynamicString();
void saveCity(City* city);
void cityAddGarden(City* city);
Kindergarden* findKindergardenByName(City* city, char* gardenName);
void addChildToSpecificGardenInCity(City* city);
void clearBuffer();
Child* getChildWithId(int id);
Child* findChildById(Kindergarden* kindergarden, int id);
void birthdayToChild(City* city);
int countChova(City* city);
void ReleaseCity(City* city);
void ReleaseKindergarden(Kindergarden* kindergarden);
void ReleaseChild(Child* child);

int menu();

int main()
{
	City utz = { NULL,0 };
	int uReq;

	//first time read
	readCity(&utz);
	do
	{
		uReq = menu();
		switch (uReq)
		{
		case  READ_CITY:
			readCity(&utz);
			break;

		case  SHOW_CITY:
			showCityGardens(&utz);
			break;

		case  SHOW_GARDEN:
			showSpecificGardenInCity(&utz);
			break;

		case  WRITE_CITY:
			saveCity(&utz);
			break;

		case  ADD_GARDEN:
			cityAddGarden(&utz);
			break;

		case  ADD_CHILD:
			addChildToSpecificGardenInCity(&utz);
			break;

		case  CHILD_BIRTHDAY:
			birthdayToChild(&utz);
			break;

		case COUNT_GRADUATE:
			printf("There are %d children going to school next year\n",countChova(&utz));
			break;

		}
	}while (uReq!=EXIT);

	ReleaseCity(&utz);//free all allocations

	return 1;
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

void printKindergarden(Kindergarden* kindergarden) {
	int i;
	printf("%s Kinder-Garden - %s, with %d kids:\n", kindergarden->name, TYPES[kindergarden->type], kindergarden->childrenCount);
	for (i = 0; i < kindergarden->childrenCount; i++) {
		printChild(kindergarden->children[i]);
	}
}

void writeKindergardenToFile(FILE* file, Kindergarden* kindergarden) {
	int i;
	fprintf(file, "%s %d %d\n", kindergarden->name, kindergarden->type, kindergarden->childrenCount);
	for (i = 0; i < kindergarden->childrenCount; i++) {
		writeChildToFile(file, kindergarden->children[i]);
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

int menu() {
	int choice;
	printf("%s", MENU);
	scanf("%d", &choice);
	clearBuffer();
	return choice;
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

char* readDynamicString() {
	int z = 0;
	char* st = malloc(z * sizeof(char));
	char c;

	do {
		scanf("%c", &c);
		st = realloc(st, (z+1) * sizeof(char));
		st[z++] = c;
	} while (c != '\n');
	st[z - 1] = '\0';
	return st;
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

Kindergarden* getKindergardenWithName(char* name) {
	Kindergarden* newKindergarden = malloc(sizeof(Kindergarden));
	newKindergarden->name = name;
	newKindergarden->childrenCount = 0;
	newKindergarden->children = malloc(0);
	printf("What type of kindergarden?\n1. HOVA\n2. TROM_HOVA\n3. TROM_TROM_HOVA\n");
	scanf("%d", &newKindergarden->type);
	return newKindergarden;
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

void clearBuffer() {
	char c;
	do {
		scanf("%c", &c);
	} while (!isspace(c));
}

Child* getChildWithId(int id) {
	Child* child = malloc(sizeof(Child));
	child->id = id;
	printf("Enter child's age:\n");
	scanf("%d", &child->age);
	return child;
}

Child* findChildById(Kindergarden* kindergarden, int id) {
	int i;
	for (i = 0; i < kindergarden->childrenCount; i++) {
		if (kindergarden->children[i]->id == id) {
			return kindergarden->children[i];
		}
	}
	return NULL;
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

void ReleaseKindergarden(Kindergarden* kindergarden) {
	int i;
	for (i = 0; i < kindergarden->childrenCount; i++) {
		ReleaseChild(kindergarden->children[i]);
	}
	free(kindergarden->name);
}

void ReleaseChild(Child* child) {
	free(child);
}

void ReleaseCity(City* city) {
	int i;
	for (i = 0; i < city->kindergardernsCount; i++) {
		free(city->kindergardens[i]);
	}
}

