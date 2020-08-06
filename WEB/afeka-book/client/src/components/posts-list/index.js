import * as React from 'react';
import { Modal } from '../modal';
import { AuthContext } from '../../App';

export const PostView = ({ post, onAddComment }) => {
    const {user} = React.useContext(AuthContext);
    const [enlargedImage, setEnlargedImage] = React.useState(null);
    const [isCommenting, setIsCommenting] = React.useState(false);
    const [commentContent, setCommentContent] = React.useState('');

    const images = !!post.imageUrls.length && <div className='thumbnails-wrapper'>
        {post.imageUrls.map((url, idx) => {
            return (
                <img
                    className='image-thumbnail'
                    onClick={() => setEnlargedImage(idx)}
                    src={`http://localhost/${url}`}
                />
            )
        })}
    </div>

    const isCurrentUserAuthor = post.author.email === user.email;

    const addComment = async () => {
        await onAddComment(post, commentContent);
        setCommentContent('');
        setIsCommenting(false);
    }

    return (
        <div className='post'>
            <div className='post-content-wrapper'>
                <div className='post-header'>
                    <span style={{ color: isCurrentUserAuthor ? 'green' : 'white' }}>
                        <b>{isCurrentUserAuthor ? 'You' : post.author.name} wrote:</b>
                    </span>
                    <span>
                        At {new Date(post.creationDate).toLocaleString()}
                    </span>
                </div>
                <hr/>
                <div className='post-content'>
                    {post.content}
                </div>
            </div>
            {images}
            {enlargedImage !== null && (
                <Modal
                    isOpen={enlargedImage !== null}
                    onClose={() => setEnlargedImage(null)}
                    body={
                        <img style={{ maxHeight: '500px' }} src={`http://localhost/${post.imageUrls[enlargedImage]}`}></img>
                    }
                />
            )}
            <div className='comments'>
                {!!post.comments.length && <h3>Comments</h3>}
                {post.comments.map((comment) => {
                    return (
                        <div className='comment'>
                            <span>By: {comment.author.name}</span>
                            <span>{comment.content}</span>
                        </div>
                    )
                })}
            </div>
            <div className='add-comment'>
                {!isCommenting && <button onClick={() => setIsCommenting(true)} style={{marginLeft: 'auto'}}>Comment</button>}
                {isCommenting && <textarea className='comment-input' value={commentContent} onChange={(e) => setCommentContent(e.target.value)}/>}
                {isCommenting && <button onClick={addComment} style={{marginLeft: 'auto'}}>Submit</button>}
            </div>
        </div>
    )
}

export const PostsList = ({ posts, onAddComment }) => {
    return (
        <div className='posts-list'>
            {posts.length
                ? posts.map((post) => <PostView post={post} onAddComment={onAddComment} />)
                : <p style={{ fontSize: '18px' }}>There are no posts to show at the moment</p>}
        </div>
    )
}