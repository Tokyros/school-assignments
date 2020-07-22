import Axios, { AxiosStatic } from 'axios';
import { LoginData } from '../model/auth';
import { Post } from '../model/posts';
import { User } from '../model/users';

const SERVER_BASE_URI = 'http://localhost';
const API_BASE_URI = `${SERVER_BASE_URI}/api`;
Axios.defaults.withCredentials = true;

export type API = {
    auth: {
        login: (loginData: LoginData) => Promise<User>;
        signup: (loginData: LoginData) => Promise<void>;
        logout: () => Promise<void>;
        me: () => Promise<User>;
    },
    feed: {
        getAllPosts: () => Promise<Post[]>;
        addPost: (post: {postContent: string}) => Promise<Post>;
    },
    users: {
        searchUsers: (searchQuery: string) => Promise<User[]>;
        addFriend: (friendEmail: string) => Promise<User[]>;
        getFriends: () => Promise<User[]>;
    },
    game: {
        setGame: (friendEmail: string) => Promise<void>;
    }
}

export const createApi = (http: AxiosStatic): API => {
    const AUTH_BASE_URI = `${API_BASE_URI}/auth`;
    const FEED_BASE_URI = `${API_BASE_URI}/feed`;
    const USERS_BASE_URI = `${API_BASE_URI}/users`;
    const GAME_BASE_URI = `${API_BASE_URI}/game`;
    return {

        auth: {
            login: (loginData: LoginData) => {
                return http.post<User>(`${AUTH_BASE_URI}/login`, loginData).then((res) => res.data);
            },
            signup: (loginData: LoginData) => {
                return http.post(`${AUTH_BASE_URI}/signup`, loginData);
            },
            logout: () => {
                return http.get(`${AUTH_BASE_URI}/logout`);
            },
            me: () => {
                return http.get<User>(`${AUTH_BASE_URI}/me`).then((res) => res.data);
            }
        },
        feed: {
            getAllPosts: () => {
                return http.get<{posts: Post[]}>(`${FEED_BASE_URI}/all`).then((res) => res.data.posts);
            },
            addPost: (post) => {
                return http.post<Post>(`${FEED_BASE_URI}/add`, post).then((res) => res.data);
            }
        },
        users: {
            searchUsers: (searchQuery) => {
                return http.get<{users: User[]}>(`${USERS_BASE_URI}/all`).then((users) => {
                    return users.data.users.filter((user) => {
                        return user.email.toLowerCase().includes(searchQuery.toLowerCase())
                            || user.name.toLowerCase().includes(searchQuery.toLowerCase())
                    })
                })
            },
            addFriend: (friendEmail) => {
                return http.post<{friends: User[]}>(`${USERS_BASE_URI}/add-friend`, {friendEmail}).then((friendsResult) => {
                    return friendsResult.data.friends;
                })
            },
            getFriends: () => {
                return http.get<User[]>(`${USERS_BASE_URI}/friends`).then((res) => res.data);
            }
        },
        game: {
            setGame: (friendEmail) => {
                return http.post<void>(`${GAME_BASE_URI}`, {friendEmail}).then((res) => res.data);
            }
        }
    }
    
}