import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LoginData } from '../model/auth';
import { APIContext } from '../App';
import { AxiosError } from 'axios';

export type LoginPageProps = {
}

export const LoginPage: React.FC<LoginPageProps> = ({}) => {
    const [email, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const api = React.useContext(APIContext);
    const history = useHistory();

    const onLoginSuccess = () => {
        history.push('/feed');
    }

    const onLogin = () => {
        return api.auth.login({email, password});
    }

    React.useEffect(() => {
        api.auth.checkLogin().then(onLoginSuccess)
    }, []);
    
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevents form from sending request to server
        e.preventDefault();
        onLogin().then(onLoginSuccess);
    }

    const onSignup = () => {
        api.auth.signup({email: email, password});
    }

    return (
        <div className='login-page'>
            <form onSubmit={onSubmit}>
                <label htmlFor="user-email">Username</label>
                <input autoComplete='email' name="user-email" type="email" value={email} onChange={(e) => setUserName(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input autoComplete='current-password' name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="submit"/>
            </form>
            <button onClick={onSignup}>first time? signup!</button>
        </div>
    )
}