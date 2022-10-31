import { GoogleLogin } from '@react-oauth/google';

const clientID = "453334165890-5hntue61242e3qo93lvdc9hng2e6hoje.apps.googleusercontent.com"

function Logout() {
    const onSuccess = () => {
        console.log("Logged out Successfully!");
    }

    return(
        <div id="signOutButton">
            <GoogleLogout
                clientID={clientID}
                buttonText={"Logout"}
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout;