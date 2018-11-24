#include "utils.h"
#include "numberGame.h"
#include "pictureManipulation.h"


int main()
{
    srand(time(NULL));

    while (1)
    {
        printf(MENU);
        switch (getChar())
        {
        case 'E':
        case 'e':
        	printf("Bye Bye\n");
            return 0;
        case 'P':
        case 'p':
            pictureManipulation();
            break;
        case 'N':
        case 'n':
            numberGame();
            break;
        default:
			printf(INVALID_CHOICE);
			break;
        }
    }
}
