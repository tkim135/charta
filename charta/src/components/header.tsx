import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import firebase from "firebase/app";
import "firebase/auth";
import {Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import SettingsIcon from '@material-ui/icons/Settings';
import grey from '@material-ui/core/colors/grey';
import SearchBar from "./searchbar";

interface HeaderProps {

}

interface HeaderState {
    firstName: string
}


class Header extends Component<HeaderProps, HeaderState>{

    async componentDidMount() {

        const db = firebase.firestore();
        let user = firebase.auth().currentUser;
        const userRef = db.collection('users').doc(user?.uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            console.log('No such user!');

        } else {
            this.setState({firstName: doc.data()?.firstName});
        }

    }


    constructor(props: HeaderProps) {
        super(props);
        this.handleSignout = this.handleSignout.bind(this);
        this.state = {firstName: ""};
    }

    handleSignout() {
        firebase.auth().signOut().then(() => {
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
                    <IconButton edge="start"  color="inherit" aria-label="menu">  </IconButton>
                    <Button><h1 id="title"><Link to="/home">Charta</Link> </h1></Button>

                    <SearchBar/>

                </Box>
                {this.state.firstName ?  <h1>Welcome, {this.state.firstName}</h1> : <h1></h1>}

                <Button color="inherit" onClick={this.handleSignout}><Link to="/signin">Sign out</Link></Button>
                <Link to={"settings"}><Button startIcon={<SettingsIcon style={{ color: grey[50] }}/>}/></Link>

            </Toolbar>
              
            </AppBar>
        </header>
       );
    }
}

export default Header

