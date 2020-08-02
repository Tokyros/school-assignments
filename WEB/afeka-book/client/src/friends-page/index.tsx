import { AuthContext, APIContext } from "../App"
import React from "react"
import { User } from "../model/users";
import { Link } from "react-router-dom";


export const FriendsPage: React.FC = () => {
    const api = React.useContext(APIContext);
    const {user: currentUser} = React.useContext(AuthContext);

    const inviteFriend = (friend: User) => () => {
        api.game.setGame(friend.email);
    }

    const friends = currentUser?.friends || [];

    const emptyState = (
        <div className='empty-friends-state'>
            <p>Your list of friends is currently empty</p>
            <p>Go to your <Link to='/feed'>feed</Link> to add friends to your friends list</p>
        </div>
    )

    return (
        <div className='friends-page'>
            {!friends.length && emptyState}
            {friends.map((friend) => {
                return <div>
                    {friend.email}
                    <button onClick={inviteFriend(friend)}>INVITE</button>
                </div>
            })}
        </div>
    )
}