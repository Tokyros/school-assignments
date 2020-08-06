import { getDb } from '..';

class UserDao {
    async getOne(email) {
        return await getDb().collection('users').findOne({ email });
    }


    async getAll() {
        return await getDb().collection('users').find().toArray();
    }


    async add(user) {
        const res = await getDb().collection('users').insert(user);
    }


    async update(user) {
        await getDb().collection('users').update({email: user.email}, user);
    }
}

export default UserDao;
