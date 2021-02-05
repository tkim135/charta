import {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, } from 'react-router-dom';
import Login from './login';
import Header from './components/header';
import Footer from './components/footer';

class App extends Component {
  

  render() {
    return (
      <div className="flex flex-col h-screen justify-between">
          <Header></Header>
          <Footer></Footer>
        </div>
      );
    }
}


export default App;




