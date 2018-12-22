#include <stdio.h>

#include "child.h"
#include "kindergarden.h"
#include "city.h"
#include "utils.h"

#define READ_CITY 1
#define SHOW_CITY 2
#define SHOW_GARDEN 3
#define WRITE_CITY 4
#define ADD_GARDEN 5
#define ADD_CHILD 6
#define CHILD_BIRTHDAY 7
#define COUNT_GRADUATE 8
#define EXIT 0


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

	ReleaseCity(&utz);

	return 1;
}
