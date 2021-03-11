import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import firebase from "firebase/app";
import "firebase/auth";
import {Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import SettingsIcon from '@material-ui/icons/Settings';
import grey from '@material-ui/core/colors/grey';
import SearchBar from "./searchbar";
import logo from "../images/circle194logo.png"

interface HeaderProps {

}

interface HeaderState {
    firstName: string
}


class Header extends Component<HeaderProps, HeaderState>{


    async componentDidMount() {

        let scope = this;
        firebase.auth().onAuthStateChanged(async function(user)  {
            if (user) {
                const db = firebase.firestore();
                const userRef = db.collection('users').doc(user?.uid);
                const doc = await userRef.get();
                scope.setState({firstName: doc.data()?.firstName});

            } else {
              user = null;
              // Code to toggle the app state to logged-out view etc.
            }
          });

    }



    constructor(props: HeaderProps) {
        super(props);
        this.handleSignout = this.handleSignout.bind(this);
        this.state = {firstName: ""};
    }

    handleSignout() {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('user');
            console.log('sign out successful');
        }).catch((error) => {
            console.log(error.code, error.message);
        });

    }

    render(){

       return (
        <header className="header">
          <AppBar position="static">
            <Toolbar>
                <Box display='flex' flexGrow={1}>
                       <img alt="Charta logo" src={logo} width="50" />
 
                    <Button><h1 id="title"><Link to="/home">Charta</Link> </h1></Button>

                    <SearchBar/>

                </Box>
                {this.state.firstName ?  <h1>Welcome, {this.state.firstName}</h1> : <h1></h1>}

                <Button color="inherit" onClick={this.handleSignout}><Link to="/signin">Sign out</Link></Button>
                <Link to={"/settings"}><Button startIcon={<SettingsIcon style={{ color: grey[50] }}/>}/></Link>

            </Toolbar>
              
            </AppBar>
        </header>
       );
    }
}

export default Header

