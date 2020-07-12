import * as React from 'react';
import { APIContext } from '../App';
import { useHistory } from 'react-router-dom';
import { Post } from '../model/posts';

export const FeedPage: React.FC = () => {
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [writingNewPost, setWritingNewPost] = React.useState(false);
    const [postContent, setPostContent] = React.useState('');

    const api = React.useContext(APIContext);
    const history = useHistory();

    React.useEffect(() => {
        api.auth.checkLogin().then(async () => {
            const posts = await api.feed.getAllPosts();
            setPosts(posts);
        }).catch(() => {
            history.push('/')
        })
    }, []);

    const submitPost = () => {
        api.feed.addPost({
            postContent
        }).then((post) => {
            setPosts([...posts, post]);
        })
    }

    const newPostModal = writingNewPost && (
        <div>
            <input type='text' value={postContent} onChange={(e) => setPostContent(e.target.value)}/>
            <button onClick={submitPost}>SUBMIT</button>
        </div>
    )

    return (
        <div>
            <div className='header'>
                <button>SEARCH</button>
                <button onClick={() => setWritingNewPost(true)}>NEW POST</button>
            </div>
            <div className='posts-list'>
                {posts.map((post) => {
                    return (
                        <div>
                            {post.content}
                        </div>
                    )
                })}
            </div>
            {newPostModal}
        </div>
    )
}