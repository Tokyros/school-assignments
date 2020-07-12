import { User } from './User';

export interface IPost {
    id: number;
    author: User;
    content: string;
    imageUrls: string[];
}

export class Post implements IPost {

    constructor(
        public id: number,
        public author: User,
        public content: string,
        public imageUrls: string[],
    ) {
        
    }
}
