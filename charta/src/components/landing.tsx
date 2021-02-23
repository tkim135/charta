
import React, {Component} from 'react';
import { Redirect } from 'react-router';
import {Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import '../App.css';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import Footer from "./footer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";

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

			<div className="flex flex-col h-screen justify-between">
				<div>
					<AppBar position="static">
						<Toolbar>

							<Box display='flex' flexGrow={1}>
								<Button><h1 id="title"><Link to="/">Charta</Link> </h1></Button>
							</Box>

							<Button><h1 id="title"><Link to="/home">Sign in</Link> </h1></Button>
							<Button><h1 id="title"><Link to="/home">Sign up</Link> </h1></Button>
						</Toolbar>

					</AppBar>
				</div>


				<Grid container spacing={3}>
					<Grid item xs={3}>

						<div className="gradient">
							<h1 className="slogan">Chart your path to graduation!</h1>
							<div>
								<div className="left">
									<h4 className="title">Welcome to Charta</h4>
									<p className="text">We know classes can be tough, and figuring out the right ones can be even tougher! That's why at Charta, we're working to take some of the stress out of planning your schedule. Charta is the perfect tool for students to organize their course plans, check their degree progress, and receive recommendations about the best courses suited for them. Give it a try!</p>
									<Button color="primary"><Link to="/signin">Sign In</Link></Button>
								</div>
								<div className="right">
									<img src={"./climb.png"} alt="Image Not Found" />
								</div>
							</div>
							<img alt="Charta logo" src={"./images/logoCropped.png"}/>
						</div>

					</Grid>
					<Grid item xs={9}>

					</Grid>
				</Grid>
				<Footer/>

			</div>
        );
    }
}

export default Landing;

