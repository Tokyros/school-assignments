import Axios, { AxiosStatic } from 'axios';
import { LoginData } from '../model/auth';
import { Post } from '../model/posts';

const SERVER_BASE_URI = 'http://localhost';
const API_BASE_URI = `${SERVER_BASE_URI}/api`;
Axios.defaults.withCredentials = true;

export type API = {
    auth: {
        login: (loginData: LoginData) => Promise<void>;
        signup: (loginData: LoginData) => Promise<void>;
        logout: () => Promise<void>;
        checkLogin: () => Promise<void>;
    },
    feed: {
        getAllPosts: () => Promise<Post[]>;
        addPost: (post: {postContent: string}) => Promise<Post>;
    }
}

export const createApi = (http: AxiosStatic): API => {
    const AUTH_BASE_URI = `${API_BASE_URI}/auth`;
    const FEED_BASE_URI = `${API_BASE_URI}/feed`;
    return {

        auth: {
            login: (loginData: LoginData) => {
                return http.post(`${AUTH_BASE_URI}/login`, loginData);
            },
            signup: (loginData: LoginData) => {
                return http.post(`${AUTH_BASE_URI}/signup`, loginData);
            },
            logout: () => {
                return http.get(`${AUTH_BASE_URI}/logout`);
            },
            checkLogin: () => {
                return http.get(`${SERVER_BASE_URI}/users`, {withCredentials: true});
            },
        },
        feed: {
            getAllPosts: () => {
                return http.get<{posts: Post[]}>(`${FEED_BASE_URI}/all`).then((res) => res.data.posts);
            },
            addPost: (post) => {
                return http.post<Post>(`${FEED_BASE_URI}/add`, post).then((res) => res.data);
            }
        }
    }
    
}