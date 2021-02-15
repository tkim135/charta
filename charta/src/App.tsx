import {Component} from 'react';
// import logo from './logo.svg';
import './App.css';


import SignIn from './auth/signin';
import SignUp from './auth/signup';
import NotFound from './components/notfound'

import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from './components/home';


class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/home" component={Home}/>
                    <Route exact path="/signin" component={SignIn} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route component={NotFound} />
                </Switch>

            </Router>

          );
    }
}


export default App;




