/*
 * test.h
 *
 *  Created on: 4 Jan 2019
 *      Author: shaharr
 */

#ifndef SRC_TEST_H_
#define SRC_TEST_H_

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "Child.h"
#include "Kindergarten.h"

// Utils
int printFailure(char* message);
int printSuccess(char* message);

// Configuration
int runAllTests();
int testsWorking();
int endTests();

// Tests
int test_childToBinary();
int test_kindergartenToBinary();

int test_readChildFromBinaryFile();
int test_readKindergartenFromBinaryFile();

#endif /* SRC_TEST_H_ */
