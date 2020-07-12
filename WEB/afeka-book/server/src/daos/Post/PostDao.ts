import { IPost } from '@entities/Post';


export interface IPostDao {
    getOne: (id: number) => Promise<IPost | null>;
    getAll: () => Promise<IPost[]>;
    add: (post: IPost) => Promise<void>;
    update: (post: IPost) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

class PostDao implements IPostDao {

    public async getOne(id: number): Promise<IPost | null> {
        // TODO
        return [] as any;
    }

    public async getAll(): Promise<IPost[]> {
        // TODO
        return [] as any;
    }

    public async add(post: IPost): Promise<void> {
        // TODO
        return {} as any;
    }


    public async update(post: IPost): Promise<void> {
        // TODO
        return {} as any;
    }

    public async delete(id: number): Promise<void> {
        // TODO
        return {} as any;
    }
}

export default PostDao;
