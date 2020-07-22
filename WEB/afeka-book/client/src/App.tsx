import React, { useEffect, createContext, useContext } from 'react';
import './App.css';
import { LoginPage } from './login-page';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useHistory
} from 'react-router-dom'
import { createApi, API } from './api';
import Axios from 'axios';
import { FeedPage } from './feed-page';
import { User } from './model/users';
import { FriendsPage } from './friends-page';

export const APIContext = createContext<API>(createApi(Axios));
export const AuthContext = createContext<{user?: User, setUser: (user: User) => void}>({
  setUser: () => null
});

function AppInner() {
  const api = React.useContext(APIContext);
  const {user, setUser} = React.useContext(AuthContext);
  const history = useHistory();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    api.auth.me().then((res) => {
      setUser(res);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      history.push('/login');
    });
  }, []);

  if (loading) {
    return <div>
      LOADING
    </div>
  }

  return (
    <div className="App">
      <Switch>
        <Route path='/feed'>
          <FeedPage/>
        </Route>
        <Route path='/friends'>
          <FriendsPage/>
        </Route>
        <Route path='/' exact={true} ren>
          <LoginPage/>
        </Route>
        <Redirect to='/'/>
      </Switch>
    </div>
  )
}

function App() {
  const [user, setUser] = React.useState<User | undefined>();
  const api = React.useRef(createApi(Axios));
  
  React.useEffect(() => {
    // api.current.auth.me().then((currUser) => setUser(currUser))
  }, []);


  return (
    <Router>
      <AuthContext.Provider value={{user, setUser}}>
        <APIContext.Provider value={api.current}>
          <AppInner/>
        </APIContext.Provider>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
