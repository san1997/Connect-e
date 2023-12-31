import { useState } from 'react';
import './loginPage.css';

export function LoginPage() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    return (
      <div className='container'>
        <input
            className='inputbox'
            type={'email'}
            placeholder='email'
        ></input>
        <input
            className='inputbox'
            type={'password'}
            placeholder='password'
        ></input>
        <button
            className='inputbox submitButton'
        >
            Submit
        </button>
        </div>
    );
  }