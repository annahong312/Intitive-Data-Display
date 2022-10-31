import { GoogleLogin } from '@react-oauth/google';

const clientID = "453334165890-5hntue61242e3qo93lvdc9hng2e6hoje.apps.googleusercontent.com"

function Login() {

    const onSuccess = (res) => {
        console.log("LOGIN SUCCESS! Current user: ", res.profileObj)
    }

    const onFailure = (res) => {
        console.log("LOGIN FAILED! res: ", res)
    }

    return(
        <div id="signInButton">
            <GoogleLogin
                clientID={clientID}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_orgin'}
                isSignedIn={true}
            />
        </div>
    )
}

export default Login;