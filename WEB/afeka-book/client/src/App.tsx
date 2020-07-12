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
import { AuthenticatedUser } from './model/auth';
import { FeedPage } from './feed-page';

export const APIContext = createContext<API>(createApi(Axios));
export const AuthContext = createContext<{user?: AuthenticatedUser, setUser: (user: AuthenticatedUser) => void}>({
  setUser: () => null
});

function AppInner() {
  return (
    <div className="App">
      <Switch>
        <Route path='/feed'>
          <FeedPage/>
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
  const [user, setUser] = React.useState<AuthenticatedUser | undefined>();
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
