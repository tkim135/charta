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


interface SignUpProps extends RouteComponentProps<any> {

}


interface SignUpState{
    email: string,
    password: string,
    confirmPassword: string,
    redirect: boolean
}

// React.Component<Props & RouteProps, State>
// RouteComponentProps, SigninProps, SigninState

class SignUp extends Component<SignUpProps, SignUpState> {


    constructor(props: SignUpProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {email: '',  password: '', confirmPassword: '', redirect: false}

    }


    handleSubmit(e:  React.FormEvent) {
        e.preventDefault();
        var scope = this;

        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                scope.setState({redirect: true})

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });

    }


    render() {
        if(this.state.redirect) {
            return <Redirect to='/home'/>;
        }

        return(
            <Container maxWidth="sm">
                <div>

                    <Typography component="h1" variant="h5" align="center">
                        Sign up
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

                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                )}}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Confirm password"
                            type="password"
                            id="confirmPassword"
                            onChange={(evt) => this.setState({confirmPassword: evt.target.value})}
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                        >
                            Sign Up
                        </Button>
                        <Grid container>

                        </Grid>
                    </form>
                </div>
            </Container>

        );
    }
}

export default withRouter(SignUp);