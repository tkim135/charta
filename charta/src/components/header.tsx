import {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { InputBase } from '@material-ui/core';

class Header extends Component{

    render(){
       return (
        <header>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start"  color="inherit" aria-label="menu">  </IconButton>
              <Typography variant="h6"> News </Typography>
                <Button color="inherit">Login</Button>
                <div className="">
              <div className="">
                <SearchIcon />
              </div>
                  <InputBase
                    placeholder="Search…"
                    
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </div>
              </Toolbar>
              
            </AppBar>
        </header>
       );
    }
}

export default Header

