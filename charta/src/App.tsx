import {Component} from 'react';
// import logo from './logo.svg';
import './App.css';


// @ts-ignore
import SignIn from './auth/signin';
// @ts-ignore
import SignUp from "./auth/signup";
import NotFound from './components/notfound'

import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
// @ts-ignore
import Home from './components/home';
import Landing from './components/landing';
import Settings from './account/settings';


class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/home" component={Home}/>
                    <Route exact path="/" component={Landing}/>
                    <Route exact path="/signin" component={SignIn} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/settings" component={Settings} />
                </Switch>

            </Router>

          );
    }
}


export default App;
