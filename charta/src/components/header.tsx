import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import firebase from "firebase/app";
import "firebase/auth";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from '@material-ui/core/TextField';
import {Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import SettingsIcon from '@material-ui/icons/Settings';
import grey from '@material-ui/core/colors/grey';

interface HeaderProps {

}

interface HeaderState {
    displayName: string
}



class Header extends Component<HeaderProps, HeaderState>{

    componentDidMount() {
        let displayName = firebase.auth().currentUser?.displayName;
        if(displayName) this.setState({displayName: displayName});
    }


    constructor(props: HeaderProps) {
        super(props);
        this.handleSignout = this.handleSignout.bind(this);
        this.state = {displayName: ""};
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


                    <TextField id="mainSearchBar"
                        fullWidth={true}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            )}}>

                    </TextField>

                </Box>
                <Link to={"settings"}><Button startIcon={<SettingsIcon style={{ color: grey[50] }}/>}/></Link>
                {this.state.displayName ?  <h1>Welcome, {this.state.displayName}</h1> : <h1></h1>}
                <Button color="inherit" onClick={this.handleSignout}><Link to="/signin">Sign out</Link></Button>

            </Toolbar>
              
            </AppBar>
        </header>
       );
    }
}

export default Header

