import {useEffect, useState} from "react";
import jwt_decode from "jwt-decode";
 
export default function Login() {
    // want to create this as a global state so its accessible 
    const [user, setUser] = useState({});

    function handleCallbackResponse(response){
        console.log("Encoded JWT ID token: " + response.credential);
        var userObject = jwt_decode(response.credential);
        console.log(userObject);
        setUser(userObject);
        document.getElementById("signInDiv").hidden = true;
    }

    function handleSignOut(event){
        setUser({});
        document.getElementById("signInDiv").hidden = false;
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
            callback: handleCallbackResponse
        })
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme: "outline", size: "large"}
        );

        google.accounts.id.prompt();

    }, [] );

    // If we have no user, show login button

    // If we have a user, show log out button 

    return(
        <div className="Login">
            <div id="signInDiv"></div>
            { Object.keys(user).length !== 0 &&
                <div>
                    <img src={user.picture} alt="Profile Pic"></img>
                    <h3>{user.name}</h3>
                    <button onClick={ (e) => handleSignOut(e) }>Sign Out</button>
                </div>
            }
        </div>
    )
}

//export default Login;