#include <ctype.h>
#include <time.h>
#include <stdlib.h>


#include "numberGame.h"
#include "pictureManipulation.h"

#define MENU "Please choose one of the following options\nP/p - Picture Manipulation\nN/n - Number Game\nE/e - Quit\n"

char getChar();

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
        }
    }
}

char getChar()
{
	char c;
    do
    {
        scanf("%c", &c);
    } while (isspace(c));
    return c;
}
