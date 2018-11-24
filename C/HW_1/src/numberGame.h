#ifndef NUMBERGAME_H_
#define NUMBERGAME_H_

#include <stdio.h>
#include <stdlib.h>

#include "matUtils.h"

#define NUM_ROWS 3
#define NUM_COLS 3
#define SHUFFLE_COUNT 30


#define YOU_WIN "You win! The game is over!\n\n"
#define YOUR_STEP "Your step: "

void numberGame();

void playNumberGame(int *mat, int rows, int cols);
int findEmptyIndex(int *mat, int rows, int cols);
int gameIsSolved(int *mat, int rows, int cols);
int maybePlayStep(int *mat, int choice, int *emptyIndex, int rows, int cols);
void shuffleMat(int *mat, int rows, int cols);
void initMatNumberGame(int *mat, int rows, int cols);
int maybeSwapNumbers(int *mat, int *emptyIndex, int numberIndex, int cols);

#endif
