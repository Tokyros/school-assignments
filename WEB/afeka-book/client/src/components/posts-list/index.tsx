import * as React from 'react';
import { Post } from '../../model/posts';

export type PostsListProps = {
    posts: Post[];
}

export const PostsList: React.FC<PostsListProps> = ({posts}) => {
    return (
        <div className='posts-list'>
            {posts.length ? posts.map((post) => {
                const images = post.imageUrls?.map((url) => {
                    return <img style={{maxHeight: '170px', border: '1px solid black', padding: '5px'}} src={`http://localhost/${url}`}/>
                })
                return (
                    <div style={{border: '1px solid black'}}>
                        <div><span style={{fontSize: '18px'}}><b>{post.author.name} wrote:</b></span> {post.content}</div>
                        <div className='images'>
                            {images}
                        </div>
                    </div>
                )
            }) : <p style={{fontSize: '18px'}}>There are no posts to show at the moment</p>}
        </div>
    )
}