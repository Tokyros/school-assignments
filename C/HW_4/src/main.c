#include <stdio.h>
#include <stdlib.h>

#include "General.h"
#include "Kindergarten.h"
#include "Child.h"
#include "City.h"


int main(int argc, char* argv[])
{
	int useBinaryFormat;
	sscanf(argv[1], "%d", &useBinaryFormat);

	City utz = { NULL,0 };
	int uReq;

	//first time read
	readCity(&utz, useBinaryFormat);

	do
	{
		uReq = menu();
		switch (uReq)
		{
		case  READ_CITY:
			readCity(&utz, useBinaryFormat);
			break;

		case  SHOW_CITY:
			showCityGardens(&utz);
			break;

		case  SHOW_GARDEN:
			showSpecificGardenInCity(&utz);
			break;

		case  WRITE_CITY:
			saveCity(&utz, useBinaryFormat);
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

		case SORT:
			showSortMenu(&utz);
			break;

		case KINDERGARTEN_LINKEDLIST:
			displayKindergartensFromList(createLinkedListForKindergartenType(&utz, getTypeOption()));
			break;

		}
	}while (uReq!=EXIT);
	
	releaseCity(&utz);//free all allocations
	
	return EXIT_SUCCESS;
}

