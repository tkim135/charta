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

import { BrowserRouter as Router} from "react-router-dom";
import firebase from "firebase";
import {Redirect} from "react-router";

interface HomeState {
    signedIn: boolean
}

interface HomeProps {

}

class Home extends Component<HomeProps, HomeState>{

    constructor(props: HomeProps) {
        super(props);
        this.state = {signedIn: false}
    }


    render() {

        if(firebase.auth().currentUser){
            return (
                <div className="flex flex-col h-screen justify-between">
                    <Header/>
                    {/*<ClassCard name="Math 51" term="Spring 2021"/>*/}
                    {/*<ClassCard name="CS 110" term="Winter 2021"/>*/}
                    <Planner/>
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




