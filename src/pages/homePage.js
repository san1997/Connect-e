import { useEffect, useState } from "react";
import { InstagramLogin } from '@amraneze/react-instagram-login';
import './homePage.css';
import FontAwesome from "react-fontawesome";
import {BASE_URL, CLIENT_ID, REDIRECT_URL} from '../constants';
import useAuthCheck from './loginCheck';


export function HomePage() {
    useAuthCheck();

    const [instaConnected, setInstaConnected] = useState(false);
    const [igUsername, setIgUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserData();
    }, [instaConnected]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/getuser`, {
                method: "GET",
                credentials: 'include' // Include credentials for cookies
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error fetching user data');
            }

            console.log('User data:', data);
            const igUsername = data.ig_username
            if (igUsername) {
                setInstaConnected(true);
                setIgUsername(igUsername); // Save the Instagram username in state
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {!instaConnected ? <ConnectInstagram setInstaConnected={setInstaConnected} /> : <ProfilePage igUsername={igUsername} />}
        </div>
    );
}

function ConnectInstagram({ setInstaConnected }) {
    const [authCode, setAuthCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (authCode) {
            oauthCallback();
        }
    }, [authCode]);

    const oauthCallback = async () => {
        try {
            const response = await fetch(`${BASE_URL}/oauthcallback`, {
                method: "POST",
                body: JSON.stringify({ "code":authCode }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Connecting Instagram failed');
            }

            // rerender HomePage about successful Instagram connection
            setInstaConnected(true);
        } catch (err) {
            console.error('Connecting Instagram failed:', err);
            setError('Connecting Instagram failed.');
        }
    };

    const handleIgSuccessResp = (response) => {
        console.log("Ig resp authcode:", response);
        setAuthCode(response);
    };

    const handleIgFailureResp = (response) => {
        console.error("Instagram connection failed:", response);
        setError('Connecting Instagram failed.');
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="instagram">
            <p>Please connect Instagram</p>
            <InstagramLogin
                clientId={CLIENT_ID}
                buttonText="Connect your Instagram"
                onSuccess={handleIgSuccessResp}
                onFailure={handleIgFailureResp}
                redirectUri={REDIRECT_URL}
                scope="user_profile"
                //useRedirect={true}
            />
            {/*<button*/}
            {/*    className='inputbox submitButton'*/}
            {/*    onClick={handleIgSuccessResp}*/}
            {/*>*/}
            {/*</button>*/}
        </div>
    );
}

function SendRoseWidget({render ,setRender}) {
    const [crushIg, setCrushIg] = useState('');
    const [roseAdded, setRoseAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const sendRoseHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setRoseAdded(false);
        setError('');

        try {
                const response = await fetch(`${BASE_URL}/addrose`, {
                    method: "POST",
                    body: JSON.stringify({ "crush": crushIg}),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Parse the response as JSON
                    throw new Error(errorData.message); // Extract
                }
                setRoseAdded(true)
                setRender(true)
        } catch (err) {
            console.error('error sending rose:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="send-rose-widget">
            <form onSubmit={sendRoseHandler}>
                <input
                    type="text"
                    className="inputbox"
                    placeholder="Enter a handle, send a rose 🌹"
                    value={crushIg}
                    onChange={e => {setCrushIg(e.target.value); setRoseAdded(false); setError('')} }
                />
                <button
                    className='submitButton'
                    type='submit'
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Send Rose'}
                </button>
            </form>
            {error && <div className="error-message">Error: {error}</div>}
            {roseAdded && <div className="rose-added-message">Rose added: {crushIg}</div>}
        </div>
    );
}

function ProfilePage({ igUsername }) {
    const [render, setRender] = useState()
    return (
        <div className="profile">
            <div className="component-spacing">
            {igUsername && <InstagramProfile igUsername={igUsername} />}
            </div>
            <div className="component-spacing">
                <SendRoseWidget render = {render} setRender = {setRender}/>
            </div>
            <div className="component-spacing">
                <StatsWidget render = {render} setRender = {setRender}
                    rosesSentCount={5}
                    rosesReceivedCount={4}
                    matchesCount={2}
                />
            </div>
            <div className="component-spacing">
                <div className="scrollable-widgets">
                    <Matches render = {render} setRender = {setRender}/>
                    <SentRoses render = {render} setRender = {setRender}/>
                </div>
            </div>
        </div>
    );
}

function InstagramProfile({ igUsername }) {
    if (!igUsername) {
        return <p className="no-connection">🔗 Connect to Instagram & start your rose journey!</p>;
    }

    return (
        <div className="instagram-profile">
            {/*<div>*/}
            {/*    <span className="instagram-icon">📸</span>*/}
            {/*</div>*/}
            <div>
                <strong className="ig-username">@{igUsername}</strong>
            </div>
            <div>
                <span className="rest-text">Spread love, send roses! 🌹</span>
            </div>
        </div>
    );
}




function SentRoses({render, setRender}) {
    const [error, setError] = useState('');
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true)
        if(render) {
            const getMatches = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/getsentroses`, {
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        throw new Error('Error getting matches');
                    }
                    const data = await response.json();
                    setMatches(data.ig_usernames)
                } catch (err) {
                    console.error('Err getting matches:', err);
                    setError('Err getting matches');
                } finally {
                    setLoading(false);
                }
            };
            getMatches();
        }
    }, [render]);

    return (
        <div>
            <div className="widget scrollable-container">
                <div className="title">Matches</div>
                {loading ? 'Loading...' :
                    <ul>
                        {matches.map(match => <li key={match}>{match}</li>)}
                    </ul>
                }
            </div>
            {error && <div className="error-message">Error: {error}</div>}
        </div>
    );
}

function Matches({render ,setRender}) {
    const [error, setError] = useState('');
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true)
        if(render) {
            const getMatches = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/getmatches`, {
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        throw new Error('Error getting matches');
                    }
                    const data = await response.json();
                    setMatches(data.matches)
                } catch (err) {
                    console.error('Err getting matches:', err);
                    setError('Err getting matches');
                } finally {
                    setLoading(false);
                }
            };
            getMatches();
        }
    }, [render]);

    return (
        <div>
            <div className="widget scrollable-container">
                <div className="title">Matches</div>
                {loading ? 'Loading...' :
                    <ul>
                        {matches.map(match => <li key={match}>{match}</li>)}
                    </ul>
                }
            </div>
            {error && <div className="error-message">Error: {error}</div>}
        </div>
    );
}

function StatsWidget({ rosesSentCount, rosesReceivedCount, matchesCount }) {
    return (
        <div className="stats-widget">
            <div className="stat">
                Received <span className="icon"> {rosesReceivedCount}🌹</span>
            </div>
            <div className="stat">
                Matches <span className="icon">{matchesCount}❤️</span>
            </div>
        </div>
    );
}



export default ProfilePage;
