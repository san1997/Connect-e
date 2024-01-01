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

    return (
        <div className='container'>
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
                    className='inputbox submitButton'
                    type='submit'
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Submit'}
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}
