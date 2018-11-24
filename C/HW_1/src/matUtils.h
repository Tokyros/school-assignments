#ifndef MATUTILS_H_
#define MATUTILS_H_

#include <stdio.h>
#include <ctype.h>
#include <time.h>
#include <stdlib.h>

#define INVALID_CHOICE "Invalid choice!\n"
#define MENU "Please choose one of the following options\nP/p - Picture Manipulation\nN/n - Number Game\nE/e - Quit\n"

void printMat(int *mat, int rows, int cols);
void swap(int* mat, int rowI, int colI, int rowJ, int colJ, int cols);
char getChar();

#endif
