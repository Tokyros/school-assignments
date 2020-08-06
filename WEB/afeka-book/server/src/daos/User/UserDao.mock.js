import { IUser } from '@entities/User';
import { getRandomInt } from '@shared/functions';
import { MockDaoMock } from '../MockDb/MockDao.mock';
import { IUserDao } from './UserDao';


class UserDao extends MockDaoMock {


    async getOne(email) {
        try {
            const db = await super.openDb();
            for (const user of db.users) {
                if (user.email === email) {
                    return user;
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
            return db.users;
        } catch (err) {
            throw err;
        }
    }


    async add(user) {
        try {
            const db = await super.openDb();
            user.id = getRandomInt();
            db.users.push(user);
            await super.saveDb(db);
        } catch (err) {
            throw err;
        }
    }


    async update(user) {
        try {
            const db = await super.openDb();
            for (let i = 0; i < db.users.length; i++) {
                if (db.users[i].id === user.id) {
                    db.users[i] = user;
                    await super.saveDb(db);
                    return;
                }
            }
            throw new Error('User not found');
        } catch (err) {
            throw err;
        }
    }


    async delete(id) {
        try {
            const db = await super.openDb();
            for (let i = 0; i < db.users.length; i++) {
                if (db.users[i].id === id) {
                    db.users.splice(i, 1);
                    await super.saveDb(db);
                    return;
                }
            }
            throw new Error('User not found');
        } catch (err) {
            throw err;
        }
    }
}

export default UserDao;
