import * as React from 'react';
import { User } from '../../model/users';

export type FriendResultProps = {
    user: User;
    isFriend: boolean;
    onAddFriend: () => void;
}

export const UserView: React.FC<FriendResultProps> = ({user, onAddFriend, isFriend}) => {

    return (
        <div className='user-view'>
            <div className='user-details'>
                <span className='name'>{user.name}</span>
            </div>
            <div className='friend-status'>
                {isFriend ? <span className='status'>{isFriend ? '✅' : ''}</span> : <button onClick={onAddFriend}>Add friend</button>}
            </div>                
        </div>
    )
}