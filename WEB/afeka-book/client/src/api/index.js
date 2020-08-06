import Axios, { AxiosStatic } from 'axios';

const SERVER_BASE_URI = 'http://localhost';
const API_BASE_URI = `${SERVER_BASE_URI}/api`;
Axios.defaults.withCredentials = true;

export const createApi = (http) => {
    const AUTH_BASE_URI = `${API_BASE_URI}/auth`;
    const FEED_BASE_URI = `${API_BASE_URI}/feed`;
    const USERS_BASE_URI = `${API_BASE_URI}/users`;
    const GAME_BASE_URI = `${API_BASE_URI}/game`;
    return {

        auth: {
            login: (loginData) => {
                return http.post(`${AUTH_BASE_URI}/login`, loginData).then((res) => res.data);
            },
            signup: (loginData) => {
                return http.post(`${AUTH_BASE_URI}/sign-up`, loginData);
            },
            logout: () => {
                return http.get(`${AUTH_BASE_URI}/logout`);
            },
            me: () => {
                return http.get(`${AUTH_BASE_URI}/me`).then((res) => res.data);
            }
        },
        feed: {
            getAllPosts: () => {
                return http.get(`${FEED_BASE_URI}`).then((res) => res.data.posts);
            },
            addPost: (post) => {
                return http.post(`${FEED_BASE_URI}`, post).then((res) => res.data);
            },
            addPostComment: (post, comment) => {
                return http.post(`${FEED_BASE_URI}/add-comment`, {post, comment}).then((res) => res.data);
            }
        },
        users: {
            searchUsers: (searchQuery) => {
                return http.get(`${USERS_BASE_URI}`).then((users) => {
                    return users.data.users.filter((user) => {
                        return searchQuery === '*'
                            || user.email.toLowerCase().includes(searchQuery.toLowerCase())
                            || user.name.toLowerCase().includes(searchQuery.toLowerCase())
                    })
                })
            },
            addFriend: (friendEmail) => {
                return http.post(`${USERS_BASE_URI}/add-friend`, {friendEmail}).then((friendsResult) => {
                    return friendsResult.data.friends;
                })
            },
        },
        game: {
            setGame: (friendEmail) => {
                return http.post(`${GAME_BASE_URI}`, {friendEmail}).then((res) => res.data);
            },
            getGame: () => {
                return http.get(`${GAME_BASE_URI}`).then((res) => res.data);
            }
        }
    }
    
}