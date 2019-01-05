#include <stdio.h>

#include "City.h"
#include "Kindergarten.h"


void readCity(City* pCity, int useBinaryFormat)
{
	if (pCity->pGardenList != NULL) {
		releaseCity(pCity);
		pCity->count = 0;
	}
	pCity->pGardenList = readAllGardensFromFile(useBinaryFormat ? DATA_FILE_BIN : DATA_FILE, &pCity->count, useBinaryFormat);

	if (pCity->pGardenList == NULL)
		printf("Error reading city information\n");
}

void	showCityGardens(City* pCity)
{
	showAllGardens(pCity->pGardenList, pCity->count);
}

void	showSpecificGardenInCity(City* pCity)
{
	showGardenMenu(pCity->pGardenList, pCity->count);
}

void saveCity(City* pCity, int useBinaryFormat)
{
	writeGardensToFile(pCity->pGardenList, pCity->count, useBinaryFormat ? DATA_FILE_BIN : DATA_FILE, useBinaryFormat);
}

void cityAddGarden(City* pCity)
{
	pCity->pGardenList = addGarden(pCity->pGardenList, &pCity->count);
	if (pCity->pGardenList == NULL)//Allocation error
		printf("Error adding kindergarten\n");
}

void	addChildToSpecificGardenInCity(City* pCity)
{
	addChildToGarden(pCity->pGardenList, pCity->count);
}

void	birthdayToChild(City* pCity)
{
	handleBirthdayToChild(pCity->pGardenList, pCity->count);
}

int	countChova(City* pCity)
{
	int i;
	int count = 0;
	for (i = 0; i < pCity->count; i++)
	{
		if (pCity->pGardenList[i]->type == Chova)
			count += pCity->pGardenList[i]->childCount;
	}
	return count;
}

void	releaseCity(City* pCity)
{
	release(pCity->pGardenList, pCity->count);
}

void showSortMenu(City* pCity) {
	int choice = sortMenu();
	switch(choice) {
		case SORT_GARDENS_BY_NAME:
			sortKindergartenByName(pCity->pGardenList, pCity->count);
			break;
		case SORT_GARDENS_BY_TYPE_AND_COUNT:
			sortKindergartensByTypeAndCount(pCity->pGardenList, pCity->count);
			break;
		case SORT_CHILDREN_BY_ID:
			sortKidregartenChildrenByID(pCity->pGardenList, pCity->count);
			break;
	}
}

LinkedList* createLinkedListForKindergartenType(City* pCity, GardenType gardenType) {
	int i;
	NODE* currentNode;
	NODE* temp;

	LinkedList* list = malloc(sizeof(LinkedList));
	list->head.next = NULL;

	if (pCity->count == 0) {
		return list;
	}

	currentNode = malloc(sizeof(NODE));
	currentNode->data = pCity->pGardenList[0];

	list->head.next = currentNode;

	for (i = 1; i < pCity->count; i++) {
		if (gardenType == pCity->pGardenList[i]->type){
			temp = malloc(sizeof(NODE));
			temp->data = pCity->pGardenList[i];
			temp->next = NULL;
			currentNode->next = temp;
			currentNode = temp;
		}
	}

	return list;
}

void displayKindergartensFromList(LinkedList* list) {

	NODE* node;
	for (node = list->head.next; node != NULL; node = node->next) {
		showGarden(node->data);
	}
}
