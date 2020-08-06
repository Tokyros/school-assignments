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
        await getDb().collection('posts').update({_id: post._id}, post, {upsert: true});
    }
}

export default PostDao;
