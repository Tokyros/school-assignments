#ifndef SRC_CITY_H_
#define SRC_CITY_H_

#include "kindergarden.h"
#include "utils.h"

typedef struct {
	Kindergarden** kindergardens;
	int kindergardernsCount;
} City;

void readCity(City* city);
void showCityGardens(City* city);
void showCityGardens(City* city);
void showSpecificGardenInCity(City* city);
void saveCity(City* city);
void cityAddGarden(City* city);
Kindergarden* findKindergardenByName(City* city, char* gardenName);
void addChildToSpecificGardenInCity(City* city);
void birthdayToChild(City* city);
int countChova(City* city);
void ReleaseCity(City* city);

#endif
