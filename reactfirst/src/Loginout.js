import LoginButton from './Components/Login.js';
import LogoutButton from './Components/Logout.js';
import { useEffect } from 'react';
import { gapi } from 'gapi-script';

const clientID = "453334165890-5hntue61242e3qo93lvdc9hng2e6hoje.apps.googleusercontent.com"

function Loginout() {

    useEffect(() => {
        function start() {
            gapi.clientID.init({
                clientID: clientID,
                scope: "" // basic scope not using any api's
            })
    
        };

        gapi.load('client:auth2', start);

      });

      return(
        <div className='App'>
            <LoginButton/>
            <LogoutButton/>
        </div>
      );

}

export default Loginout;