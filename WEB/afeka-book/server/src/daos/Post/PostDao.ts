import { IPost } from '@entities/Post';
import { getDb } from '..';


export interface IPostDao {
    getOne: (id: number) => Promise<IPost | null>;
    getAll: () => Promise<IPost[]>;
    add: (post: IPost) => Promise<void>;
    update: (post: IPost) => Promise<void>;
}

class PostDao implements IPostDao {
    public async getOne(id: number): Promise<IPost | null> {
        return await getDb().collection('posts').findOne({id});
    }


    public async getAll(): Promise<IPost[]> {
        return await getDb().collection('posts').find().toArray();
    }


    public async add(post: IPost): Promise<void> {
        await getDb().collection('posts').insert(post);
    }


    public async update(post: IPost): Promise<void> {
        await getDb().collection('posts').update({_id: (post as any)._id}, post, {upsert: true});
    }
}

export default PostDao;
