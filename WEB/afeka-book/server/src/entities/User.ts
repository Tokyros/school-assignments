export interface IUser {
    id: number;
    name: string;
    email: string;
    pwdHash: string;
    friendIds: number[];
    isPlaying: boolean;
}

export class User implements IUser {

    public id: number;
    public name: string;
    public email: string;
    public pwdHash: string;
    public friendIds: number[];
    public isPlaying: boolean;


    constructor(
        nameOrUser: string,
        email: string,
        pwdHash: string,
        id: number,
        friendIds: number[] = []
    ) {

        this.isPlaying = false;
        this.name = nameOrUser;
        this.email = email;
        this.pwdHash = pwdHash;
        this.id = id;
        this.friendIds = friendIds || [];
    }
}
