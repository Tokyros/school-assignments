import { getDb } from '..';

class PostDao {
    async getOne(id) {
        return await getDb().collection('posts').findOne({id});
    }


    async getAll() {
        return await getDb().collection('posts').find().toArray();
    }


    async add(post) {
        await getDb().collection('posts').insert(post);
    }


    async update(post) {
        // Make sure mongo doesn't see this as an attempt to change id
        delete post._id;
        await getDb().collection('posts').update({id: post.id}, post, {upsert: true});
    }
}

export default PostDao;
