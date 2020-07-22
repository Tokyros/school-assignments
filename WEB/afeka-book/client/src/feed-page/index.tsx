import * as React from 'react';
import { APIContext, AuthContext } from '../App';
import { useHistory } from 'react-router-dom';
import { Post } from '../model/posts';
import { User } from '../model/users';

export const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = React.useState(value);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delay);
		
		return () => clearTimeout(timeoutId);
	}, [value]);

	return debouncedValue;
}

export const FeedPage: React.FC = () => {
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [writingNewPost, setWritingNewPost] = React.useState(false);
    const [postContent, setPostContent] = React.useState('');
    
    const [searchQuery, setSearchQuery] = React.useState('');
    const [users, setUsers] = React.useState<User[]>([]);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 700);
    const api = React.useContext(APIContext);
    const {user: currentUser, setUser} = React.useContext(AuthContext);

    React.useEffect(() => {
        if (currentUser) {
            api.users.searchUsers(debouncedSearchQuery).then((usersResult) => setUsers(usersResult.filter((user) => user.email !== currentUser?.email)));
        }
    }, [debouncedSearchQuery, currentUser]);


    const history = useHistory();

    React.useEffect(() => {
        // api.auth.checkLogin().then(async () => {
        //     const posts = await api.feed.getAllPosts();
        //     setPosts(posts);
        // }).catch(() => {
        //     history.push('/')
        // })
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

    const addFriend = (email: string) => () => {
        api.users.addFriend(email).then((res) => {
            if (currentUser) {
                setUser({
                    ...currentUser,
                    friends: res
                })
            }
        });
    }

    console.log(currentUser);
    return (
        <div>
            <div className='header'>
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search people' />
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
            <div className='user-list'>
                {users.map((user) => 
                    <div className='user'>
                        {user.name}
                        {currentUser?.friends.find((friend) => friend.email === user.email) && "IS FRIEND"}
                        <button onClick={addFriend(user.email)}>Add friend</button>
                    </div>
                )}
            </div>
            <div>
                <button onClick={() => history.push('/friends')}>
                    SEE FRIENDS
                </button>
            </div>
            {newPostModal}
        </div>
    )
}