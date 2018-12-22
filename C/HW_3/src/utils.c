#include "utils.h"

char* MENU = "Select:\n1. Read city information from file.\n2. Show all kindergardens.\n3. Show a specific kindergarden.\n4. Save city information to file\n5. Add a kindergarden\n6. Add a child\n7. Birthday to a child\n8. Count hova children\n0. EXIT.\n";

int menu() {
	int choice;
	printf("%s", MENU);
	scanf("%d", &choice);
	clearBuffer();
	return choice;
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

void clearBuffer() {
	char c;
	do {
		scanf("%c", &c);
	} while (!isspace(c));
}
