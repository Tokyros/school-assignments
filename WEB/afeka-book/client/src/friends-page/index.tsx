import { AuthContext, APIContext } from "../App"
import React from "react"
import { User } from "../model/users";


export const FriendsPage: React.FC = () => {
    const api = React.useContext(APIContext);
    const {user: CurrentUser} = React.useContext(AuthContext);

    const inviteFriend = (friend: User) => () => {
        api.game.setGame(friend.email);
    }

    return (
        <div className='friends-page'>
            {CurrentUser?.friends.map((friend) => {
                return <div>
                    {friend.email}
                    <button onClick={inviteFriend(friend)}>INVITE</button>
                </div>
            })}
        </div>
    )
}