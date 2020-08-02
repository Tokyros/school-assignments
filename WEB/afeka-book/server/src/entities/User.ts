export enum UserRoles {
    Standard,
    Admin,
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    pwdHash: string;
    role: UserRoles;
    friendIds: number[];
    isPlaying: boolean;
}

export class User implements IUser {

    public id: number;
    public name: string;
    public email: string;
    public role: UserRoles;
    public pwdHash: string;
    public friendIds: number[];
    public isPlaying: boolean;


    constructor(
        nameOrUser?: string | IUser,
        email?: string,
        role?: UserRoles,
        pwdHash?: string,
        id?: number,
        friendIds?: number[]
    ) {
        if (typeof nameOrUser === 'string' || typeof nameOrUser === 'undefined') {
            this.name = nameOrUser || '';
            this.email = email || '';
            this.role = role || UserRoles.Standard;
            this.pwdHash = pwdHash || '';
            this.id = id || -1;
            this.friendIds = friendIds || [];
        } else {
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
            this.role = nameOrUser.role;
            this.pwdHash = nameOrUser.pwdHash;
            this.id = nameOrUser.id;
            this.friendIds = nameOrUser.friendIds;
        }
        this.isPlaying = false;
    }
}
