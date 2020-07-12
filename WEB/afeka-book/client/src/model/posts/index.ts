export type Author = {
    name: string;
}

export type Post = {
    content: string;
    author: Author;
    imageUrls: string[];
}