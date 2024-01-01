import { useState, useEffect } from 'react';
import './loginPage.css';
import { useNavigate } from "react-router-dom";
import {BASE_URL} from '../constants';
import useAuthCheck from './loginCheck';

export function LoginPage() {
    useAuthCheck();

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

    return (<div>
            <div>
                <WelcomeWidget/>
            </div>
            <div className='container'>
                Login/Signup
                <form onSubmit={submitHandler}>
                    <input
                        className='inputbox'
                        type='email'
                        placeholder='email'
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
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>

    </div>

    );
}

function WelcomeWidget() {
    return (
        <div className="welcome-widget">
            <p>
                    Roses are red,
                    <br />
                    Violets are blue,
                    <br />
                    Send a secret rose to your crush,
                    <br />
                    And they might send one to you too.
                    <br />
                    Only if it's a match,
                    <br />
                    Will we reveal the catch.
                    <br />
                    But if it's one-way,
                    <br />
                    Your secret we'll obey.
            </p>
        </div>
    );
}

