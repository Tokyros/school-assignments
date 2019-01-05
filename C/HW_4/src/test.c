#include "test.h"

typedef unsigned char Byte;

int printSuccess(char* message) {
	printf("✅ ");
	printf("%s\n", message);
	return 1;
}

int printFailure(char* message) {
	printf("❌ ");
	printf("%s\n", message);
	return 0;
}

int runAllTests() {
	return     testsWorking()
			&& test_childToBinary()
			&& test_readChildFromBinaryFile()
			&& test_readKindergartenFromBinaryFile()
			&& endTests();
}

int testsWorking() {
	printSuccess("Test framework operational. All system a-go");
	return 1;
}

int test_childToBinary() {
	Child child = { 0x1F00, 0x1 };

	Byte expected[2];
	expected[0] = (Byte) 0x0;
	expected[1] = (Byte) 0x3F;

	Byte* actual = childToBinary(&child);

	if (expected[0] == actual[0] && expected[1] == actual[1]) {
		free(actual);
		return printSuccess("Converts child to binary");
	} else {
		free(actual);
		return printFailure("Converts child to binary");
	}
}

//int test_kindergartenToBinary() {
//	Garden kindergarten = { "Garden", 1, NULL, 0 };
//	Child** children = malloc(sizeof(Child));
//	Child* child = malloc(sizeof(Child));
//	child -> age = 1;
//	child -> age = 1;
//	children[0] = child;
//	kindergarten.childPtrArr = children;
//
//	Byte expected[14];
//	expected[0] = 0;
//	expected[1] = 1;
//	expected[2] = 1;
//	expected[3] = 1;
//	expected[4] = 1;
//	expected[5] = 1;
//	expected[6] = 1;
//	expected[7] = 1;
//	expected[8] = 1;
//	expected[9] = 1;
//	expected[10] = 1;
//	expected[11] = 1;
//	expected[12] = 1;
//	expected[13] = 1;
//	expected[14] = 1;
//
//	Byte* actual = kindergartenToBinary(kindergarten);
//
//	if (expected[0] == actual[0] && expected[1] == actual[1]) {
//		free(actual);
//		return printSuccess("Converts kindergarten to binary");
//	} else {
//		free(actual);
//		return printFailure("Converts kindergarten to binary");
//	}
//}

int test_readChildFromBinaryFile() {
	FILE* file = fopen("DataFile.bin", "rb");
	Child expected = { 1234, 5 };
	Child* actual;
	if (!file) {
		return printFailure("Could not read binary file");
	}

	fseek(file, sizeof(int)*2 + 10, SEEK_SET);

	actual = readChildFromBinaryFile(file);

	if (actual->age == expected.age && actual->id == expected.id) {
		return printSuccess("Reads Child from binary");
	} else {
		return printFailure("Reads Child from binary");
	}
}

int test_readKindergartenFromBinaryFile() {
	FILE* file = fopen("DataFile.bin", "rb");
	Garden expected = { "Sunshine", 0, NULL, 1 };

	Child* expectedChild = malloc(sizeof(Child));
	expectedChild->age = 5;
	expectedChild->id = 1234;

	Child** expectedChildrenArr = (Child**) malloc(sizeof(Child));
	expectedChildrenArr[0] = expectedChild;
	expected.childPtrArr = expectedChildrenArr;

	Garden* actual;
	if (!file) {
		return printFailure("Could not read binary file");
	}

	fseek(file, sizeof(int), SEEK_SET);

	actual = readGardenFromBinaryFile(file);

	if (strcmp(expected.name, actual->name) == 0 && expected.type == actual->type && expected.childCount == actual->childCount) {
		return printSuccess("Reads Child from binary");
	} else {
		return printFailure("Reads Child from binary");
	}
}

int endTests() {
	printSuccess("All tests ran successfully");
	return 1;
}
