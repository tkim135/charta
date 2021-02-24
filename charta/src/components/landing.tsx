
import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import '../App.css';

import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Footer from "./footer";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";

interface LandingState {}
interface LandingProps {}

class Landing extends Component<LandingProps, LandingState>{

    constructor(props: LandingProps) {
        super(props);
    }

    render() {

    	return(

			<div className="flex flex-col h-screen justify-between">
				<div>
					<AppBar position="static">
						<Toolbar>

							<Box display='flex' flexGrow={1}>
								<Button><h1 id="title"><Link to="/">Charta</Link> </h1></Button>
							</Box>

							<Button><h1 id="title"><Link to="/signin">Sign in</Link> </h1></Button>
							<Button><h1 id="title"><Link to="/signup">Sign up</Link> </h1></Button>
						</Toolbar>

					</AppBar>
				</div>

				<Grid container spacing={8} direction="row" alignItems="center">
					<Grid item xs={3}>
						<div className="gradient">
						</div>
						<img alt="Charta logo" src={"./images/croppedLogo.png"}/>
					</Grid>
					<Grid item xs={4}>
							<p className="intro">Welcome to Charta</p>
							<p className="info">We know classes can be tough, and figuring out the right ones can be even tougher! That's why at Charta, we're working to take some of the stress out of planning your schedule.</p>
							<p className="info">Charta is the perfect tool for students to organize their course plans, check their degree progress, and receive recommendations about the best courses suited for them.</p>
							<Button color="primary"><Link to="/signin">Chart your path!</Link></Button>
					</Grid>
					
					<Grid item xs={5}>
						<img src={"./images/climb.png"} alt="Student Image"/>
					</Grid>
				</Grid>
				<Footer/>
			</div>
        );
    }
}

export default Landing;

