import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InstagramLogin } from '@amraneze/react-instagram-login';
import './homePage.css';
import FontAwesome from "react-fontawesome";
import {BASE_URL} from '../constants';

export function HomePage() {



    const loggedIn = true;
    const instaConnected = true;
    const [insta, setInsta] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${BASE_URL}/getuser`,
        {
            method: "GET",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
        })
        .then(function(res){ console.log('rrr', res); })
        .then(res => {
            console.log('res', res)
        })
        .catch(err => {
            console.log('err', err);
        })
    }, []);

    useEffect(() => {
        if (!loggedIn) {
            // to login page
            navigate("/", {replace: true});
        }
    }, [loggedIn]);

    return (
      <div>
        {
            !instaConnected
            ? <ConnectInstagram/>
            : <ProfilePage/>
        }
        </div>
    );
  }

function ConnectInstagram() {

    const responseInstagram = (response) => {
        console.log(response);
      };

    return (
        <div className="instagram">
            + Please connect instagram
            <InstagramLogin
                clientId="963715064870711"
                buttonText="Connect your instagram"
                onSuccess={responseInstagram}
                onFailure={responseInstagram}
            />
        </div>
    );
}

function ProfilePage() {
    
    return (
        <div className="profile">
            <SendRoseWidget/>            

            <SentRoses/>

            <Matches/>
        </div>
    );
}

function SendRoseWidget () {
    return ( <div >
        <div className="title">Send Rose</div>
        <div className="body">
            <input
                className='inputbox'
                type={'text'}
                placeholder='kiaraaliaadvani'
            ></input>
            <button className='inputBox submitButton sendRoseButton'>
                <FontAwesome name="paper-plane"/>
            </button>
        </div>

    </div>);
}

function SentRoses () {
    const matches = ['a', 'b', 'c'];
    return (
        <div >
            <div className="title">Roses sent</div>
            {
                matches.map(match => 
                    <ul>
                        {match}
                    </ul>
                )
            }
        </div>
    );
}

function Matches () {
    const matches = ['a', 'b', 'c'];
    return (
        <div >
            <div className="title">Matches</div>
            {
                matches.map(match => 
                    <ul>
                        {match}
                    </ul>
                )
            }
        </div>
    );
}