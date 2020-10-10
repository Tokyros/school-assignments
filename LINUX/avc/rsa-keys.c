#include <stdlib.h>
#include <stdio.h>
#include <math.h>

int modularInverse(int num, int field_num) {
    num = num % field_num;
    for (int i = 1; i < field_num; i++) {
        if ((num * i) % field_num == 1) {
            return i;
        }
    }

    // No multiplicative inverse in the field for num
    return -1;
}

int isPrime(long int num)
{

    int i;

    int j = sqrt(num);

    for (i = 2; i <= j; i++)
    {

        if (num % i == 0)

            return 0;
    }

    return 1;
}

int main(int argc, char* argv[]) {
    int p, q, n, phi, e, d;

    if (argc < 3) {
        printf("Error: Script expects two prime numbers passed as arguments\n");
        exit(1);
    }

    p = atoi(argv[1]);
    q = atoi(argv[2]);

    // atoi returns 0 if no number is read, since 0 itself is not prime we
    // can consider this as a failure
    if (!p || !q) {
        printf("Error: Passed arguments are not numbers, please enter two prime numbers\n");
        exit(1);
    }

    if (!isPrime(p) || !isPrime(q)) {
        printf("Error: Both numbers must be prime numbers, preferably of similar magnitude\n");
        exit(1);
    }

    n = p * q;
    phi = (p - 1) * (q - 1);

    for (int i = 2; i < phi; i++) {
        if (i != p && i != q && phi % i != 0 && isPrime(i)) {
            e = i;
            d = modularInverse(e, phi);
            break;
        }
    }

    printf("Private key: (%d, %d)\n", n, e);
    printf("Public key: (%d, %d)\n", n, d);
}
