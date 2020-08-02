import { AuthContext, APIContext } from "../App"
import React from "react"
import { User } from "../model/users";
import { Link } from "react-router-dom";


export const FriendsPage: React.FC = () => {
    const api = React.useContext(APIContext);
    const [game, setGame] = React.useState<{player1: User; player2: User;} | null>(null);
    const {user: currentUser} = React.useContext(AuthContext);

    React.useEffect(() => {
        api.game.getGame().then((game) => {
            setGame(game);
        })
    }, [])

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
    const invitedEmails = [game?.player1?.email, game?.player2?.email];

    const isCurrentUserInvited = invitedEmails.includes(currentUser?.email);

    return (
        <div className='friends-page'>
            {!friends.length && emptyState}
            {friends.map((friend) => {
                const isFriendInvited = isCurrentUserInvited && invitedEmails.includes(friend.email);

                return <div>
                    <span>{friend.name}</span>
                    {isFriendInvited && <span style={{marginLeft: '10px'}}>Invited ✅</span>}
                    {!isFriendInvited && <button onClick={inviteFriend(friend)}>Invite to game</button>}
                </div>
            })}
        </div>
    )
}