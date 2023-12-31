import { useState, useEffect } from 'react';
import './loginPage.css';
import { useNavigate } from "react-router-dom";
import {BASE_URL} from '../constants';

export function LoginPage() {
    const loggedIn = false;
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn) {
            // to login page
            navigate("/home", {replace: true});
        }
    }, [loggedIn]);

    const submitHanlder = () => {
        console.log('tt', username, password, BASE_URL);

        fetch(`${BASE_URL}/login`,
        {
            method: "POST",
            body: JSON.stringify({
                username, password
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
        })
        .then(function(res){ console.log('rrr', res); return res.json()})
        .then(res => {
            console.log('res', res);
            document.cookie = res.accesstoken
        })
        .catch(err => {
            console.log('err', err);
        })

        // setTimeout(() => {
        //     navigate('/home');
        // }, 3000);
    }

    return (
      <div className='container'>
        <input
            className='inputbox'
            type={'email'}
            placeholder='email'
            onChange={e => setUsername(e.target.value)}
        ></input>
        <input
            className='inputbox'
            type={'password'}
            placeholder='password'
            onChange={e => setPassword(e.target.value)}
        ></input>
        <button
            className='inputbox submitButton'
            onClick={submitHanlder}
        >
            Submit
        </button>
        </div>
    );
  }