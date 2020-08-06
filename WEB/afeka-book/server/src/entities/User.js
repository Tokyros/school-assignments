export class User {

    id;
    name;
    email;
    pwdHash;
    friendIds;
    isPlaying;


    constructor(
        nameOrUser,
        email,
        pwdHash,
        id,
        friendIds = []
    ) {

        this.isPlaying = false;
        this.name = nameOrUser;
        this.email = email;
        this.pwdHash = pwdHash;
        this.id = id;
        this.friendIds = friendIds || [];
    }
}
