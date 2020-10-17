The scripts:

1. generate-keys:

  This script accepts two prime numbers and generates the private and public keys used to encrypt and decrypt a file respectfully.

  Run instructions: generate-keys primeNumber primeNumber
  Output: private key: key.pri, public key: key.pub

2. hash:

  This script accepts an input file and an output file, performs the folding hash technique and writes the hash to the output file.

  Run instructions: hash -i inputFileName -o outputFileName
  Output: The output file provided with the resulting hash inside.

3. encrypt-decrypt:

  This script accepts three arguments: the encryption/decryption key (private/public), the file to encrypt/decrypt, the file to write the result to.
  The script will then encrypt/decrypt the contents of the input file and write the result into the output file.

  Run instructions: encrypt-decrypt -k key -i inputFileName -o outputFileName
  Output: The output file with the encrypted/decrypted contents.

  Note: the key provided to this script is a file containing the private/public key.

4. diff:
  
  This script accepts two files as arguments and tells if the contents of those files are identical.

  Run instructions: diff inputFileName outputFileName
  Output: The output should be visible in the terminal window and it will tell if the files match or not.


Project instructions:

1. Make sure you have all of the scripts mentioned above and the following files: key.pub (public key), plain text file, a file containing a digital fingerprint.

2. Run the hash script on the plain text file: hash -i inputFileName -o outputFileName.

3. Run the encrypt/decrypt script with the public key on the digital fingerprint file: encrypt-decrypt -k key.pub -i inputFileName -o outpuFileName.

4. To figure out if the hash is identical to the fingerprint decryption run the diff script between them: diff hashFileName decryptedFileName - the result will be displayed in the terminal window.
