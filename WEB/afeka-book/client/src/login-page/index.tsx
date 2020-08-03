import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { APIContext, AuthContext } from '../App';

export type LoginPageProps = {
}

const BAD_LOGIN_DATA_ERROR = 'One of the parameters provided is invalid, please use a valid email and a non-empty password';
const MAIL_ALREADY_REGISTERED_ERROR = 'Mail is already in use, please try another one';
export const LoginPage: React.FC<LoginPageProps> = () => {
    const {setUser} = React.useContext(AuthContext);
    const [email, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const api = React.useContext(APIContext);
    const history = useHistory();

    const onLoginSuccess = () => {
        history.push('/feed');
    }

    const onLogin = () => {
        return api.auth.login({email, password}).then((user) => {
            setUser(user);
        }).catch((e) => {
            switch (e.response.status) {
                case 400:
                    setErrorMessage(BAD_LOGIN_DATA_ERROR);
                    break;
                case 401:
                    setErrorMessage('Either the E-mail or password you entered are incorrect or you might not be registered to FaceAfeka™, try again');
                    break;
            }

            console.error('An error occurred while login a user in', e);

            throw e;
        });
    }
    
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevents form from sending request to server
        e.preventDefault();
        onLogin().then(onLoginSuccess);
    }

    const onSignup = () => {
        return api.auth.signup({email, password}).catch((e) => {
            (e.response);
            switch (e.response.status) {
                case 409:
                    setErrorMessage(MAIL_ALREADY_REGISTERED_ERROR);
                    break;
                case 400:
                    setErrorMessage(BAD_LOGIN_DATA_ERROR);
                    break;
            }

            console.error('An error occurred while signing a user up', e);

            throw e;
        });
    }

    return (
        <div className='login-page'>
            <h1>FaceAfeka - Login</h1>
            <p style={{maxWidth: '220px'}}>Welcome to FaceAfeka™! The best place online to meet friends and play awesome games</p>
            <p> please log in to you account</p>
            {errorMessage && <p style={{color: '#ff6a6a'}}>{errorMessage}</p>}
            <form onSubmit={onSubmit} className='login-form'>
                <label htmlFor="user-email">E-mail</label>
                <input placeholder='e.g. bob@gmail.com' autoComplete='email' name="user-email" type="email" value={email} onChange={(e) => {
                    setErrorMessage('');
                    setUserName(e.target.value);
                }}/>
                <label htmlFor="password">Password</label>
                <input autoComplete='current-password' name="password" type="password" value={password} onChange={(e) => {
                    setErrorMessage('');
                    setPassword(e.target.value);
                }}/>
                <input className='login-btn' type="submit" value='Log-in'/>
            </form>
            <hr/>
            <p style={{maxWidth: '240px'}}>Don't have an account yet? Click <button className='login-btn' onClick={onSignup}>here</button> to sign-up with an email and a password started today!</p>
        </div>
    )
}