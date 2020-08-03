import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import { cookieProps } from '@shared/constants';


interface IClientData {
    id: number;
}

export class JwtService {

    private readonly secret: string;
    private readonly options: object;
    private readonly VALIDATION_ERROR = 'JSON-web-token validation failed.';


    constructor() {
        this.secret = 'FA_JWT';
        this.options = {expiresIn: cookieProps.options.maxAge.toString()};
    }


    public getJwt(data: IClientData): Promise<string> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(data, this.secret, this.options, (err, token) => {
                err ? reject(err) : resolve(token);
            });
        });
    }


    public decodeJwt(jwt: string): Promise<IClientData> {
        return new Promise((res, rej) => {
            jsonwebtoken.verify(jwt, this.secret, (err: VerifyErrors | null, decoded?: object) => {
                return err ? rej(this.VALIDATION_ERROR) : res(decoded as IClientData);
            });
        });
    }
}
