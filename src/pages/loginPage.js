import React, { useState, useEffect } from 'react';
import './loginPage.css';
import { useNavigate } from "react-router-dom";
import {BASE_URL} from '../constants';
import useAuthCheck from './loginCheck';

export function LoginPage() {
    useAuthCheck();
    const [signUpStarted, setSignUpStarted] = useState(false);
    return (
        <div>
            <WelcomeWidget/>
            <StartSignUpWidget setSignUpStarted={setSignUpStarted} signUpStarted={signUpStarted}/>
            {!signUpStarted && <LoginWidget/>}
        </div>
    );
}

function LoginWidget() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    return <div className='container'>
            Login
            <form onSubmit={submitHandler}>
                <input
                    className='inputbox'
                    type='text'
                    placeholder='Enter your Instagram Username'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    className='inputbox'
                    type='password'
                    placeholder='Password'
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
}

function StartSignUpWidget({setSignUpStarted, signUpStarted}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [signUpcode, setSignUpCode] = useState('');

    const signUpsubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${BASE_URL}/startsignup`, {
                method: "POST",
                body: JSON.stringify({"username": username}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json(); // Parse the JSON response body
                throw new Error(errorResponse.message || 'Signup failed');
            }
            setSignUpStarted(true)
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    const finishSignUpsubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${BASE_URL}/finishsignup`, {
                method: "POST",
                body: JSON.stringify({
                    "username": username,
                    "password": password,
                    "code": signUpcode,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json(); // Parse the JSON response body
                throw new Error(errorResponse.message || 'Signup failed');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    return <div>
        {signUpStarted ?
            <div className='container'>
                Complete Signup
                <form onSubmit={finishSignUpsubmitHandler}>
                    <input
                        className='inputbox'
                        type='password'
                        placeholder='Create password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <input
                        className='inputbox'
                        type='text'
                        placeholder='Input the code sent to your Instagram.'
                        value={signUpcode}
                        onChange={e => setSignUpCode(e.target.value)}
                        required
                    />
                    <button
                        className='submitButton'
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Signup'}
                    </button>
                    {error && <div className="error-message">{error}</div>}
                </form>
                <button
                    className='retro-logout-button'
                    type='button'
                    onClick={() => setSignUpStarted(false)}
                >
                    Update username
                </button>
            </div> :
            <div className='container'>
                Signup
                <form onSubmit={signUpsubmitHandler}>
                    <input
                        className='inputbox'
                        type='text'
                        placeholder='Enter your Instagram Username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <button
                        className='submitButton'
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Signup'}
                    </button>
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
        }
    </div>
}

function WelcomeWidget() {
    return (
        <div className="welcome-widget">
            <h4>How It Works 🌹</h4>
            <p>
                <strong>1.</strong> Pick any Instagram username and send them a rose without revealing your identity.
            </p>
            <p>
                <strong>2.</strong> If they send a rose back to you, it's a match! We'll let both of you know.
            </p>
            <p>
                <strong>3.</strong> No match? No worries. Your secret crush remains just that – a secret!
            </p>
        </div>
    );
}

