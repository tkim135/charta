import {Component} from 'react';
// import logo from './logo.svg';
import '../App.css';

import Header from './header';
import Footer from './footer';
import Typography from "@material-ui/core/Typography";
import notfound from "../images/error.png"
import Grid from '@material-ui/core/Grid';



class NotFound extends Component {

    render() {
        return (
                <div className="flex flex-col h-screen justify-between align-center">
                    <Header/>

                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        >

                            <img src={notfound} width="300"/>
                            <Typography component="h1" variant="h5" align="center">
                                Oops! We couldn't find what you're looking for.
                            </Typography>
                        

                        </Grid> 

                      


                    <Footer/>
                </div>
        );
    }
}


export default NotFound;




