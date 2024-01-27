import { useState, useEffect } from 'react';
import './loginPage.css';
import { useNavigate } from "react-router-dom";
import {BASE_URL} from '../constants';
import useAuthCheck from './loginCheck';

export function SignupPage({username}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [signUpUsername, setSignupUsername] = useState('');
    const [signUperror, setSignUperror] = useState('');

    const navigate = useNavigate();


    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            navigate("/home", { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');

        } finally {
            setLoading(false);
        }
    };

    const signUpsubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSignUperror('');

        try {
            const response = await fetch(`${BASE_URL}/startsignup`, {
                method: "POST",
                body: JSON.stringify({"username": signUpUsername}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }
            navigate("/home", { replace: true });
        } catch (err) {
            console.error('Signup error:', err);
            setSignUperror('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (<div>
            <div>
                <WelcomeWidget/>
            </div>
            <div>
                <div className='container'>
                    Signup
                    <form onSubmit={signUpsubmitHandler}>
                        <input
                            className='inputbox'
                            type='text'
                            placeholder='Instagram username'
                            value={signUpUsername}
                            onChange={e => setSignupUsername(e.target.value)}
                            required
                        />
                        <button
                            className='submitButton'
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Signup'}
                        </button>
                        {signUperror && <div className="error">{signUperror}</div>}
                    </form>
                    Login
                    <form onSubmit={submitHandler}>
                        <input
                            className='inputbox'
                            type='text'
                            placeholder='Instagram username'
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                        <input
                            className='inputbox'
                            type='password'
                            placeholder='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            className='submitButton'
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                        {error && <div className="error">{error}</div>}
                    </form>
                </div>
            </div>
        </div>

    );
}


