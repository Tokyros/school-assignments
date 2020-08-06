import * as React from 'react';

export const UserView = ({user, onAddFriend, isFriend}) => {

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