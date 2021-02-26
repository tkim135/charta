import React, {Component} from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import firebase from "firebase/app";
import "firebase/auth";
import { withRouter } from 'react-router'
import {RouteComponentProps} from "react-router";
import { Redirect } from 'react-router'
import {Link } from 'react-router-dom';

interface SigninProps extends RouteComponentProps<any> {

}


interface SigninState{
    email: string,
    password: string,
    redirect: boolean,
    failed: boolean,
    errorMsg: string,
}

class Signin extends Component<SigninProps, SigninState> {


    constructor(props: SigninProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {email: '',  password: '', redirect: false, failed: false, errorMsg: ''}
        this.handleEmailReset = this.handleEmailReset.bind(this);

    }


    handleSubmit(e:  React.FormEvent) {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((userCredential) => {

                localStorage.setItem('user', userCredential?.toString())
                this.setState({redirect: true});

            })
            .catch((error) => {
                console.log(error.code, error.message);
                this.setState({failed: true})
                this.setState({errorMsg: error.message})

            });
    }

    handleClose() {

    }

    handleEmailReset() {

    }



    render() {

        if(this.state.redirect) {
            return <Redirect to='/home'/>;
        }

        return(
            <Container maxWidth="sm">
                <div>
                    <img alt="Charta logo" src={"./Logo.png"}/>
                    <Typography component="h1" variant="h5" align="center">
                        Sign in
                    </Typography>
                    <form noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={(evt) => this.setState({email: evt.target.value})}
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                )}}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={(evt) => this.setState({password: evt.target.value})}
                            autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                )}}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <p>{this.state.errorMsg}</p>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                        >
                            <strong>Sign In</strong>
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <p onClick={this.handleEmailReset}>
                                    Forgot password?
                                </p>
                            </Grid>


                            <Grid item>
                                <Link to="/signup">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>


            </Container>

        );
    }
}

export default withRouter(Signin);



