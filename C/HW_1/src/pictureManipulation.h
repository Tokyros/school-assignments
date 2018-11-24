#ifndef PICTUREMANIPULATION_H_
#define PICTUREMANIPULATION_H_

#include <stdio.h>
#include <stdlib.h>

#include "matUtils.h"

#define MAT_SIZE 3
#define MAX 100
#define MIN 1

#define MENU_TEXT "Please choose one of the following options\n1 - 90 degree clockwise\n2 - 90 degree counter clockwise\n3 - Flip Horizontal\n4 - Flip Vertical\n-1 - Quit\n\n"
#define AFTER_MANIPULATION_HEADER "--------- picture after manipulation ---------\n\n"

void pictureManipulation();
int showMenu(int *mat);

void initRandomMat(int *mat, int rows, int cols);
void transposeMat(int *mat, int rows, int cols);

void rotate90ClockWise(int *mat, int rows, int cols);
void rotate90CounterClockWise(int *mat, int rows, int cols);
void flipVertically(int *mat, int rows, int cols);
void flipHorizontally(int *mat, int rows, int cols);

#endif
