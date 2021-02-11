import {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, } from 'react-router-dom';
import Login from './login';
import Header from './components/header';
import Footer from './components/footer';
import ClassCard from './components/card';
import Planner from './components/planner';
// import { firebase } from '@firebase/app';
// import 'firebase/firestore';
import 'firebase/firestore'
import './firebase';
import firebase from "firebase";



class App extends Component {

    async componentDidMount() {
        const db = firebase.firestore();

        const cityRef = db.collection('users').doc('ruben1');
        const doc = await cityRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data());
        }

    }

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




