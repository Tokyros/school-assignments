import * as React from 'react';
import { APIContext, AuthContext } from '../App';
import { useHistory } from 'react-router-dom';
import { Modal } from '../components/modal';
import { UserView } from '../components/user-view';
import { PostsList } from '../components/posts-list';
import { AddPost } from '../components/add-post';

export const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = React.useState(value);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delay);
		
		return () => clearTimeout(timeoutId);
	}, [value, delay]);

	return debouncedValue;
}

export const FeedPage = () => {
    const [posts, setPosts] = React.useState([]);
    const [writingNewPost, setWritingNewPost] = React.useState(false);
    
    const [searchQuery, setSearchQuery] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [searching, setSearching] = React.useState(false);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 700);
    
    const history = useHistory();
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
                api.users.searchUsers(debouncedSearchQuery).then((usersResult) => setUsers(usersResult.filter((user) => user.email !== currentUser.email)));
            } else {
                setUsers([]);
            }
        }
    }, [debouncedSearchQuery, currentUser, api.users]);

    if (!currentUser) {
        history.push('/');
        return null;
    }

    const submitPost = (textContent, fileIds, isPrivate) => {        
        api.feed.addPost({
            postContent: textContent,
            imageIds: fileIds,
            isPrivate
        }).then((post) => {
            setPosts([...posts, post]);
            setWritingNewPost(false);
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

    const addFriend = (email) => () => {
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
                            isFriend={!!currentUser.friends.find((friend) => friend.email === user.email)}
                            onAddFriend={addFriend(user.email)}
                        />
                    )}
                </div>
            </div>
        )}/>
    )

    const onSignOut = () => {
        api.auth.logout().then(() => {
            history.push('/');
        });
    }

    const onAddComment = async (post, comment) => {
        const updatePost = await api.feed.addPostComment(post, comment);
        setPosts(posts.map((existingPost) => {
            return existingPost.id === post.id ? updatePost : existingPost;
        }))
    }

    return (
        <>
            {searchUsersModal}
            <div className='header'>
                <div className='menu'>
                    <b>FaceAfeka</b>
                    <button onClick={() => setSearching(true)}>Search Users</button>
                    <button onClick={() => setWritingNewPost(true)}>Add post</button>
                    <button onClick={() => history.push('/friends')}>Friends list</button>
                    <button onClick={onSignOut}>Sign out</button>
                </div>
                <div className='logged-in-user'>
                    Logged in as: {currentUser.name}
                </div>
            </div>
            <PostsList onAddComment={onAddComment} posts={posts}/>
            {newPostModal}
        </>
    )
}