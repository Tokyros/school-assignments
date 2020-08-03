import { IUser } from '@entities/User';
import { getDb } from '../';


export interface IUserDao {
    getOne: (email: string) => Promise<IUser | null>;
    getAll: () => Promise<IUser[]>;
    add: (user: IUser) => Promise<void>;
    update: (user: IUser) => Promise<void>;
}

class UserDao implements IUserDao {
    public async getOne(email: string): Promise<IUser | null> {
        return await getDb().collection('users').findOne<IUser>({ email });
    }


    public async getAll(): Promise<IUser[]> {
        return await getDb().collection('users').find<IUser>().toArray();
    }


    public async add(user: IUser): Promise<void> {
        const res = await getDb().collection('users').insert(user);
    }


    public async update(user: IUser): Promise<void> {
        await getDb().collection('users').update({email: user.email}, user);
    }
}

export default UserDao;
