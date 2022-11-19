import { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

gapi.load('client:auth2', initClient);
function initClient() {
  gapi.client.init( {
    discoveryDocs: ["https://script.googleapis.com/$discovery/rest?version=v1"],
  });
}

export default function Login(props) {
    const [open, setOpen] = useState(true);

    const sucessfulLogin = tokenResponse => {
        gapi.client.setToken({
          access_token: tokenResponse.access_token
        })
        setOpen(false);
        props.onLogin();
        setTimeout(relogin, (tokenResponse.expires_in - 60) * 1000);
    }

    const login = useGoogleLogin({
        onSuccess: token => sucessfulLogin(token),
        flow: "implicit",
        scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.scriptapp",
    });

    const handleClose = (event, reason) => {
        if(!(reason === "escapeKeyDown" || reason === "backdropClick")) {
            setOpen(false);
        }
    }

    const relogin = () => {
        setOpen(true);
    }

    return(
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
            {"Please login into Google"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                To access the data, please login with your USC account and grant the app the associated permissions. Your permissions will expire after an hour and you will be prompted to login in again
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={login}>Login</Button>
            </DialogActions>
        </Dialog>
      );
}