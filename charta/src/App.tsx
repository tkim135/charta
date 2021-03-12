import {Component} from 'react';
// import logo from './logo.svg';
import './App.css';


// @ts-ignore
import SignIn from './auth/signin';
// @ts-ignore
import SignUp from "./auth/signup";

import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
// @ts-ignore
import Home from './components/home';
import Landing from './components/landing';
import Settings from './account/settings';
import StudyGroups from './components/study';
import SearchResults from './components/searchresults';
import RecommenderPage from './components/recommenderpage'
import NotFound from './components/notfound';
import 'firebase';

class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Landing}/>
                    <Route exact path="/home" component={Home}/>
                    <Route exact path="/signin" component={SignIn} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/settings" component={Settings} />
                    <Route path='/recs' component={RecommenderPage}/>
                    <Route path="/search/:courseId" component={SearchResults} />
                    <Route exact path="/studygroups/:courseId" component={StudyGroups} />
                    <Route path="/*" component={NotFound} />
                </Switch>

            </Router>

          );
    }
}


export default App;