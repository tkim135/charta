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
import {Link} from "react-router-dom";
import PersonIcon from '@material-ui/icons/Person';

interface SignUpProps extends RouteComponentProps<any> {

}


interface SignUpState{
    firstName: string,
    email: string,
    password: string,
    confirmPassword: string,
    redirect: boolean,
    errorMsg: string,
    agree: boolean
}


class SignUp extends Component<SignUpProps, SignUpState> {


    constructor(props: SignUpProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createAccount = this.createAccount.bind(this);

        this.state = {firstName: '', email: '',  password: '', confirmPassword: '', redirect: false, errorMsg: '', agree: false}

    }


    async createAccount() {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(async (userCredential) => {
                // Signed in
                let user = userCredential.user;
                const db = firebase.firestore();
                localStorage.setItem('user', userCredential?.toString())

                await db.collection('users').doc(user?.uid).set({"firstName": this.state.firstName, "email":this.state.email, "quarters": []});

                // user?.uid
                this.setState({redirect: true})

            })
            .catch((error) => {
                this.setState({errorMsg: error.message})
            });
    }


    async handleSubmit(e:  React.FormEvent) {
        e.preventDefault();

        if(!this.state.email.endsWith("@stanford.edu")) {
            this.setState({errorMsg: "Email must be a stanford email"});
            return;
        }

        if(this.state.password !== this.state.confirmPassword) {
            this.setState({errorMsg: "Passwords must match"});
            return;
        }

        // if(!this.state.agree) {
        //     this.setState({errorMsg: "You must agree to the terms and conditions"});
        //     return;
        // }

        await this.createAccount();

    }


    render() {
        if(this.state.redirect) {
            return <Redirect to='/home'/>;
        }

        return(
            <Container maxWidth="sm">
                <div>

                    <img alt="Charta logo" src={"./Logo.png"}/>
                    <div>
                        <Typography component="h1" variant="h5" align="center">
                            Sign up
                        </Typography>
                    </div>


                    <form noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First name"
                            name="firstName"
                            onChange={(evt) => this.setState({firstName: evt.target.value})}
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                )}}
                        />

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
                        {/*<FormControlLabel*/}
                        {/*    control={<Checkbox color="primary" required={true} value={this.state.agree}/>}*/}
                        {/*    label="I agree to the terms and conditions"*/}
                        {/*/>*/}
                        <p>{this.state.errorMsg}</p>

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
                            <Grid item>
                                <Link to="/signin">
                                    {"Have an account?"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>

        );
    }
}

export default withRouter(SignUp);