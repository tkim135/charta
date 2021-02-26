import React, {Component} from 'react';
// import logo from './logo.svg';
// import { BrowserRouter, Route, } from 'react-router-dom';
// import Login from './login';
import Header from './header';
import Footer from './footer';
// @ts-ignore
// import ClassCard from './card';
// @ts-ignore
import Planner from './planner';
// @ts-ignore
import Recommendation from './recommendation';
import firebase from "firebase";
import {Redirect} from "react-router";
import Grid from '@material-ui/core/Grid';
import signin from "../auth/signin";

interface HomeState {
    signedIn: boolean
}

interface HomeProps {

}

class Home extends Component<HomeProps, HomeState>{

    constructor(props: HomeProps) {
        super(props);
        // this.state = {signedIn: firebase.auth().currentUser !== null}

        this.state = {
            signedIn: localStorage.getItem('user') !== null,
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({signedIn: true});
            }
            else {
                this.setState({signedIn: false});
            }
        });
    }


    render() {


        if(this.state.signedIn){
            return (
                <div className="flex flex-col h-screen justify-between">
                    <Header/>


                    {/*<Planner/>*/}
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <Recommendation/>

                        </Grid>
                        <Grid item xs={9}>
                            <Planner/>

                        </Grid>
                    </Grid>
                    <Footer/>

                </div>



            );
        }
        else{
            return <Redirect to='/signin'/>;
        }
    }



}


export default Home;



