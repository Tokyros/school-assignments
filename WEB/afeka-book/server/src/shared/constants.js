// Strings
export const paramMissingError = 'One or more of the required parameters was missing.';
export const userExistsError = 'The provided email already exists in the system.';
export const loginFailedErr = 'Login failed';

// Numbers
export const pwdSaltRounds = 12;

// Cookie Properties
export const cookieProps = {
    key: '_FAC',
    secret: 'COOKIE_SECRET',
    options: {
        httpOnly: true,
        signed: true,
        path: '/',
        // 3 days
        maxAge: 259200000,
        domain: 'localhost',
        secure: false,
    },
};
