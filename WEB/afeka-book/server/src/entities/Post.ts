import { User } from './User';

export interface IPost {
    id: number;
    author: User;
    content: string;
    imageUrls: string[];
    creationDate: number;
    isPrivate: boolean;
    comments: Array<{content: string, author: User}>;
}

export class Post implements IPost {

    constructor(
        public id: number,
        public author: User,
        public content: string,
        public imageUrls: string[],
        public creationDate: number,
        public isPrivate: boolean,
        public comments: Array<{content: string, author: User}>
    ) {
        
    }
}
