import React, {Component} from 'react';
// import logo from './logo.svg';
import '../App.css';

import Header from './header';
import Footer from './footer';
import {BrowserRouter as Router} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

class NotFound extends Component {

    render() {
        return (
                <div className="flex flex-col h-screen justify-between">
                    <Header/>
                    <div>
                        <Typography component="h1" variant="h5" align="center">
                            We couldn't find what you're looking for :/
                        </Typography>
                    </div>


                    <Footer/>
                </div>
        );
    }
}


export default NotFound;




