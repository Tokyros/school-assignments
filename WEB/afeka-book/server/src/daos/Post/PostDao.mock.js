import { getRandomInt } from '@shared/functions';
import { MockDaoMock } from '../MockDb/MockDao.mock';

class PostDao extends MockDaoMock {


    async getOne(id) {
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


    async getAll() {
        try {
            const db = await super.openDb();
            return db.posts;
        } catch (err) {
            throw err;
        }
    }


    async add(post) {
        try {
            const db = await super.openDb();
            post.postId = getRandomInt();
            db.posts.push(post);
            await super.saveDb(db);
        } catch (err) {
            throw err;
        }
    }


    async update(post) {
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


    async delete(id) {
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
