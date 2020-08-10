import { AuthContext, APIContext } from "../App"
import React from "react"
import { Link } from "react-router-dom";


export const FriendsPage = () => {
    const api = React.useContext(APIContext);
    const [game, setGame] = React.useState(null);
    const [invitedFriends, setInvitedFriends] = React.useState([]);
    const {user: currentUser} = React.useContext(AuthContext);

    React.useEffect(() => {
        api.game.getGame().then((game) => {
            setGame(game);
            const invitedEmails = [game?.player1?.email, game?.player2?.email];
            setInvitedFriends(invitedEmails);
        });
    }, [])

    const inviteFriend = (friend) => () => {
        setInvitedFriends([...invitedFriends, friend.email]);
        api.game.setGame(friend.email);
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
            {!friends.length && emptyState}
            {friends.map((friend) => {
                return <div key={friend.email}>
                    <span>{friend.name}</span>
                    {invitedFriends.includes(friend.email) && <span style={{marginLeft: '10px'}}>Invited ✅</span>}
                    {!invitedFriends.includes(friend.email) && <button onClick={inviteFriend(friend)}>Invite to game</button>}
                </div>
            })}
        </div>
    )
}