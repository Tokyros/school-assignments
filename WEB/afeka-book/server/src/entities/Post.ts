import { User } from './User';

export interface IPost {
    postId: number;
    author: User;
    content: string;
    imageUrls: string[];
    creationDate: number;
    isPrivate: boolean;
    comments: {content: string, author: User}[];
}

export class Post implements IPost {


    constructor(
        public postId: number,
        public author: User,
        public content: string,
        public imageUrls: string[],
        public creationDate: number,
        public isPrivate: boolean,
        public comments: {content: string, author: User}[]
    ) {}
}
