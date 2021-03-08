# Final project - bruteforce decryption

This project uses MPI and OPENMP to decrypt a given encrypted text, using a known key length, and a set of known words.

## How to run:
1. Write the text you would like to encrypt inside `text-files/input.txt`
3. `cd` into `cipher-text` and run `make` to build the `cipher` program which encrypts the text
4. Still inside `cipher-text`, run `make run` to encrypt the file, the result will be saved to `text-files/encrypted.txt`
5. `cd` out into the root folder
6. run `make build` to build the `decipher` program
7. run `make run` to execute the decryption on the encrypted file
8. The program will output the best matching key.


## Implementation detail

### main.c
This is the main file executed when deciphering the text file.
The algorithm is as follows:

1. Instantiate two processes using MPI
2. The main process takes care of reading the encrypted file, reading the known words file and calculate the range of possible key values
3. The main process assigns to itself half of the keys, and passes the required information to the secondary process
4. Each process creates a hashset of known words which will be used to check the validity of a decrypted file
5. Each process calls the `OpenMPTask` function which will attempt to decrypt the file with a range of given keys, and return the best match out of all the keys
6. Then the secondary process will send it's best match to the main process
7. The main process compares it's results with the secondary process results and print the best matching decryption.

### utils.c
This file has some helpers provided by Afeka to help decrypting, encrypting and reading the files.

### simple_hash.c
This file includes an implementation of a hash_set found online, all the credits to the author were kept inside the file.