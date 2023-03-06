import * as React from 'react';
import { useState } from 'react'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import { Typography, Link } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Amplify } from "aws-amplify";
import awsmobile from "../../aws-exports";
import { Auth } from 'aws-amplify';

import Register from "./Register"
import ConfirmEmail from "./ConfirmEmail"
import ForgotPassword from "./ForgotPasswordComponent"

import LoadingButton from '../LoadingButton';
import backgroundImage from "../../Images/backgroundImageForLoginPage.jpg";

Amplify.configure(awsmobile);

export default function Login(props) {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [contentToShow, setContentToShow] = useState("login");
    const [loginPageErrorText, setLoginPageErrorText] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    const [loginButtonState, setLoginButtonState] = useState("Ready");
    const [componentWidth, setComponentWidth] = useState("100%");


    async function signIn() {
        setLoginButtonState("Loading");
        try {
            const user = await Auth.signIn(Email, Password);
            setLoginButtonState("Success");
        } catch (e) {
            console.log(e.message);
            switch (e.message) {
                case 'Incorrect username or password.':
                    setLoginPageErrorText('Incorrect username or password.')
                    setLoginFailed(true)
                    setLoginButtonState("Ready");
                    break;
                case 'Custom auth lambda trigger is not configured for the user pool.':
                    setLoginPageErrorText('Please Enter A Password')
                    setLoginFailed(true)
                    setLoginButtonState("Ready");
                    break;
                case 'Username cannot be empty':
                    setLoginPageErrorText('Please Enter A Email')
                    setLoginFailed(true)
                    setLoginButtonState("Ready");
                    break;
                case 'User does not exist.':
                    setLoginPageErrorText('Incorrect username or password.')
                    setLoginFailed(true)
                    setLoginButtonState("Ready");
                    break;
                case 'User is not confirmed.':
                    setContentToShow("unverifiedAccount");
                    setLoginButtonState("Ready");
                    break;
                case 'Password attempts exceeded':
                    setLoginPageErrorText('Password attempts exceeded. Please try again later.z')
                    setLoginFailed(true)
                    setLoginButtonState("Ready");
                    break;

              }
        }
    }

    const theme = useTheme();
    //Is true if it is a tablet device or lower
    const deviceIsPhone = useMediaQuery(theme.breakpoints.down('sm'));

  
    return (
        <>
            <Grid container
            justifyContent='center'
            style={{backgroundColor: "#FFFFFF", height: deviceIsPhone ? "105vh" : "93.4vh", paddingLeft: "10%", paddingRight: "10%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no",}}
            sx={{height: '200%'}}>
                <Grid
                    item
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                   {contentToShow == "login" && <Paper sx={{width: componentWidth, pl:"3%", pr:"3%"}}>
                        <Typography variant='h5' sx={{pt: "16px"}} align='left'>Login To Your Account</Typography>
                        <Typography align="left" sx={{pt: "16px"}}>Email</Typography>
                        <TextField
                            onChange={(e)=>{
                                setEmail(e.target.value); 
                                setLoginPageErrorText('');
                                setLoginFailed(false)}}
                            onKeyDown={(e) => {if(e.key == 'Enter') {signIn()}}}
                            sx={{width: "100%"}}
                            error={loginFailed}
                            helperText={loginPageErrorText}
                        />
                        <Typography align="left" sx={{pt: "16px"}}>Password</Typography>
                        <TextField
                            onChange={(e)=>{
                                setPassword(e.target.value); 
                                setLoginPageErrorText('');
                                setLoginFailed(false)}}
                            onKeyDown={(e) => {if(e.key == 'Enter') {signIn()}}}
                            sx={{width: "100%"}}
                            type="password"
                        />
                        <Typography align="left"><Link sx={{cursor: 'pointer'}} onClick={()=>{setContentToShow("forgotPassword")}}>Forgot Your Password?</Link></Typography>
                        <Paper elevation={0}>
                            <LoadingButton buttonText={"Login"} state={loginButtonState}  onClickFunction={signIn} mt={"32px"} mr={"0xpx"} ml={"0xpx"} mb={"0xpx"} />
                            {/* <Button sx={{width: "100%", mt: "32px"}} onClick={() => {signIn()}} variant="contained" disableElevation>
                                Login
                            </Button> */}
                        </Paper>
                        <Typography align='left' sx={{pt: "16px", pb: "16px"}}>Don't have an Account? <Link sx={{cursor: 'pointer'}} onClick={()=>{setContentToShow("register")}}>Register Here</Link></Typography>
                    </ Paper>}
                    {contentToShow == "unverifiedAccount" && <ConfirmEmail componentWidth={componentWidth} setContentToShow={setContentToShow} userEmail={Email}/>}
                    {contentToShow == "forgotPassword" && <ForgotPassword componentWidth={componentWidth} setContentToShow={setContentToShow} />}
                    {contentToShow == "register" && <Register componentWidth={componentWidth} setContentToShow={setContentToShow}/>}
                </Grid>
            </Grid>
        </>
    );
}