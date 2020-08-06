import { User } from './User';

export class Post {


    constructor(
        postId,
        author,
        content,
        imageUrls,
        creationDate,
        isPrivate,
        comments
    ) {
        this.postId = postId;
        this.author = author;
        this.content = content;
        this.imageUrls = imageUrls;
        this.creationDate = creationDate;
        this.isPrivate = isPrivate;
        this.comments = comments;
    }
}
