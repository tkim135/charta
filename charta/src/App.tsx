import {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
// import { BrowserRouter, Route, } from 'react-router-dom';
// import Login from './login';
import Header from './components/header';
import Footer from './components/footer';
// @ts-ignore
import ClassCard from './components/card';
// @ts-ignore
import Planner from './components/planner';



class App extends Component {


    render() {
    return (
      <div className="flex flex-col h-screen justify-between">
          <Header/>
          <ClassCard name="Math 51" term="Spring 2021"/>
          <ClassCard name="CS 110" term="Winter 2021"/>

          <Planner/>
          <Footer/>
        </div>
      );
    }
}


export default App;




