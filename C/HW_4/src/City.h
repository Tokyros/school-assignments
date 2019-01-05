#ifndef __CITY__
#define __CITY__

#include "Kindergarten.h"
#include "General.h"

#define DATA_FILE "DataFile.txt"
#define DATA_FILE_BIN "DataFile.bin"

typedef struct
{
	Garden** pGardenList;
	int count;
}City;

typedef struct node
{
	void* data;
	struct node* next;
} NODE;

typedef struct
{
	NODE head;
} LinkedList;


void	readCity(City* pCity, int useBinaryFormat);
void	showCityGardens(City* pCity);
void	showSpecificGardenInCity(City* pCity);
void	saveCity(City* pCity, int useBinaryFormat);
void	cityAddGarden(City* pCity);
void	addChildToSpecificGardenInCity(City* pCity);
void	birthdayToChild(City* pCity);
int		countChova(City* pCity);
void	releaseCity(City* pCity);
void showSortMenu(City* pCity);

LinkedList* createLinkedListForKindergartenType(City* pCity, GardenType gardenType);
void displayKindergartensFromList(LinkedList* list);

#endif
