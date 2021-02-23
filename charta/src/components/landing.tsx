
import React, {Component} from 'react';
import { Redirect } from 'react-router';
import {Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import '../App.css';
import Button from '@material-ui/core/Button';

interface LandingState {
    signUp: boolean,
    signIn: boolean,
}

interface LandingProps {

}

class Landing extends Component<LandingProps, LandingState>{

    constructor(props: LandingProps) {
        super(props);
        this.state = {signUp: false, signIn: false}
    }

    render() {
    	if(this.state.signUp) {
    		return <Redirect to='/signup'/>;
    	}
    	if (this.state.signUp) {
    		return <Redirect to='/signin'/>;
    	}

    	return(
            <div className="gradient">
            	<div><h1 className="slogan">Chart your path to graduation!</h1></div>
            	<div>
            		<div className="left">
            			<h4 className="title">Welcome to Charta.</h4>
            			<p className="text">We know classes can be tough, and figuring out the right ones can be even tougher! That's why at Charta, we're working to take some of the stress out of planning your schedule. Charta is the perfect tool for students to organize their course plans, check their degree progress, and receive recommendations about the best courses suited for them. Give it a try!</p>
            		<Button color="primary"><Link to="/signin">Sign In</Link></Button>
            		</div>
            		<div className="right">
            			<img src={"./images/climb.png"} alt="Image Not Found" height={15} width={15}/>
            		</div>
            	</div>
            	<img alt="Charta logo" src={"./images/logoCropped.png"}/>
            </div>
        );
    }
}

export default Landing;

