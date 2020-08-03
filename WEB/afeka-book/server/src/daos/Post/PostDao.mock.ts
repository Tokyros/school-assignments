import { getRandomInt } from '@shared/functions';
import { MockDaoMock } from '../MockDb/MockDao.mock';
import { IPostDao } from './PostDao';
import { IPost } from '@entities/Post';

class PostDao extends MockDaoMock implements IPostDao {


    public async getOne(id: number): Promise<IPost | null> {
        try {
            const db = await super.openDb();
            for (const post of db.posts) {
                if (post.id === id) {
                    return post;
                }
            }
            return null;
        } catch (err) {
            throw err;
        }
    }


    public async getAll(): Promise<IPost[]> {
        try {
            const db = await super.openDb();
            return db.posts;
        } catch (err) {
            throw err;
        }
    }


    public async add(post: IPost): Promise<void> {
        try {
            const db = await super.openDb();
            post.postId = getRandomInt();
            db.posts.push(post);
            await super.saveDb(db);
        } catch (err) {
            throw err;
        }
    }


    public async update(post: IPost): Promise<void> {
        try {
            const db = await super.openDb();
            for (let i = 0; i < db.posts.length; i++) {
                if (db.posts[i].id === post.postId) {
                    db.posts[i] = post;
                    await super.saveDb(db);
                    return;
                }
            }
            throw new Error('Post not found');
        } catch (err) {
            throw err;
        }
    }


    public async delete(id: number): Promise<void> {
        try {
            const db = await super.openDb();
            for (let i = 0; i < db.posts.length; i++) {
                if (db.posts[i].id === id) {
                    db.posts.splice(i, 1);
                    await super.saveDb(db);
                    return;
                }
            }
            throw new Error('Post not found');
        } catch (err) {
            throw err;
        }
    }
}

export default PostDao;
