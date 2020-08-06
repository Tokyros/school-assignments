import jsonwebtoken from 'jsonwebtoken';
import { cookieProps } from '@shared/constants';

export class JwtService {

    secret;
    options;
    VALIDATION_ERROR = 'JSON-web-token validation failed.';


    constructor() {
        this.secret = 'FA_JWT';
        this.options = {expiresIn: cookieProps.options.maxAge.toString()};
    }


    getJwt(data) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(data, this.secret, this.options, (err, token) => {
                err ? reject(err) : resolve(token);
            });
        });
    }


    decodeJwt(jwt) {
        return new Promise((res, rej) => {
            jsonwebtoken.verify(jwt, this.secret, (err, decoded) => {
                return err ? rej(this.VALIDATION_ERROR) : res(decoded);
            });
        });
    }
}
