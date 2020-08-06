import React from 'react';
import './App.css';
import { LoginPage } from './login-page';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from 'react-router-dom';
import { createApi } from './api';
import Axios from 'axios';
import { FeedPage } from './feed-page';
import { FriendsPage } from './friends-page';

export const APIContext = React.createContext(createApi(Axios));
export const AuthContext = React.createContext({
  setUser: () => null
});

function AppInner() {
  const api = React.useContext(APIContext);
  const {setUser} = React.useContext(AuthContext);
  const history = useHistory();
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    api.auth.me().then((res) => {
      setUser(res);
      setLoading(false);
      history.push('/feed');
    }).catch(() => {
      setLoading(false);
      history.push('/login');
    });
  }, [api.auth, history, setUser]);

  if (loading) {
    return <div>
        Loading application...
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
  const [user, setUser] = React.useState();
  const api = React.useRef(createApi(Axios));

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
