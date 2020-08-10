import { AuthContext, APIContext } from "../App"
import React from "react"
import { Link } from "react-router-dom";


export const FriendsPage = () => {
    const api = React.useContext(APIContext);
    const [invitedFriends, setInvitedFriends] = React.useState([]);
    const {user: currentUser} = React.useContext(AuthContext);

    React.useEffect(() => {
        api.game.getGame().then((game) => {
            const invitedEmails = [game?.player1?.email, game?.player2?.email];
            if (invitedEmails.includes(currentUser?.email)) {
                setInvitedFriends(invitedEmails);
            }
        });
    }, [])

    const inviteFriend = (friend) => () => {
        api.game.setGame(friend.email).then(() => {
            setInvitedFriends([currentUser.email, friend.email]);
        });
    }

    const friends = currentUser?.friends || [];

    const emptyState = (
        <div className='empty-friends-state'>
            <p>Your list of friends is currently empty</p>
            <p>Go to your <Link to='/feed'>feed</Link> to add friends to your friends list</p>
        </div>
    );

    return (
        <div className='friends-page'>
            {friends.length ? <Link to='/feed'>Back to feed</Link> : null}
            <h1>Friend list</h1>
            {!friends.length && emptyState}
            {friends.map((friend) => {
                return (
                    <div key={friend.email}>
                        <span>User: </span>
                        <span style={{fontSize: '16px', fontWeight: '900', marginRight: '5px'}}>{friend.name}</span>
                        {invitedFriends.includes(friend.email) && <span>✅&nbsp;&nbsp;Already invited to game</span>}
                        {!invitedFriends.includes(friend.email) && <button onClick={inviteFriend(friend)}>Invite to game</button>}
                    </div>
                )
            })}
        </div>
    )
}