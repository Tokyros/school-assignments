export type Author = {
    name: string;
    email: string;
}

export type Post = {
    content: string;
    author: Author;
    imageUrls: string[];
    creationDate: number;
    id: number;
    comments: Array<{content: string, author: Author}>
}