import * as React from 'react';
import { APIContext, AuthContext } from '../App';
import { useHistory } from 'react-router-dom';
import { Post } from '../model/posts';
import { User } from '../model/users';
import { Modal } from '../components/modal';
import { UserView } from '../components/user-view';
import { PostsList } from '../components/posts-list';
import { AddPost } from '../components/add-post';

export const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = React.useState(value);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delay);
		
		return () => clearTimeout(timeoutId);
	}, [value, delay]);

	return debouncedValue;
}

export const FeedPage: React.FC = () => {
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [writingNewPost, setWritingNewPost] = React.useState(false);
    const [postContent, setPostContent] = React.useState('');
    
    const [searchQuery, setSearchQuery] = React.useState('');
    const [users, setUsers] = React.useState<User[]>([]);
    const [searching, setSearching] = React.useState(false);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 700);
    const api = React.useContext(APIContext);
    const {user: currentUser, setUser} = React.useContext(AuthContext);

    React.useEffect(() => {
        api.feed.getAllPosts().then((posts) => {
            setPosts(posts);
        })
    }, [api.feed])

    React.useEffect(() => {
        if (currentUser) {
            if (debouncedSearchQuery) {
                api.users.searchUsers(debouncedSearchQuery).then((usersResult) => setUsers(usersResult.filter((user) => user.email !== currentUser?.email)));
            } else {
                setUsers([]);
            }
        }
    }, [debouncedSearchQuery, currentUser, api.users]);


    const history = useHistory();

    const submitPost = (textContent: string, fileIds: string[]) => {        
        api.feed.addPost({
            postContent: textContent,
            imageIds: fileIds
        }).then((post) => {
            setPosts([...posts, post]);
            setWritingNewPost(false);
            setPostContent('');
        })
    }

    const newPostModal = (
        <Modal
            isOpen={writingNewPost}
            onClose={() => setWritingNewPost(false)}
            body={(
                <AddPost onPostAdded={submitPost}/>
            )}
        />
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

    const searchUsersModal = (
        <Modal isOpen={searching} onClose={() => setSearching(false)} body={(
            <div>
                <h2>Search for friends - </h2>
                <h3>Type '*' to see a list of all registered users</h3>
                <div className='user-list'>
                    <input style={{width: '90%'}} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search people' />
                    {!!users.length && <p>Here are the search results:</p>}
                    {users.map((user) => 
                        <UserView
                            user={user}
                            isFriend={!!currentUser?.friends.find((friend) => friend.email === user.email)}
                            onAddFriend={addFriend(user.email)}
                        />
                    )}
                </div>
            </div>
        )}/>
    )

    console.log(currentUser);
    return (
        <div>
            {searchUsersModal}
            <div className='header'>
                <button onClick={() => setSearching(true)}>Search Users</button>
                <button onClick={() => setWritingNewPost(true)}>Add post</button>
                <button onClick={() => history.push('/friends')}>Friends list</button>
            </div>
            <PostsList posts={posts}/>
            {newPostModal}
        </div>
    )
}