import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import firebase from "firebase/app";
import "firebase/auth";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from '@material-ui/core/TextField';
import {Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';


interface HeaderProps {

}


class Header extends Component{


    constructor(props: HeaderProps) {
        super(props);
        this.handleSignout = this.handleSignout.bind(this);
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
                    <Button><Typography variant="h6"> Charta </Typography></Button>

                    <TextField
                        fullWidth={true}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            )}}>

                    </TextField>
                </Box>

                <Button color="inherit" onClick={this.handleSignout}><Link to="/signin">Sign out</Link></Button>

            </Toolbar>
              
            </AppBar>
        </header>
       );
    }
}

export default Header

