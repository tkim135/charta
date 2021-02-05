import {Component} from 'react';


class Header extends Component{

    render(){
       return (
        <header className="lg:px-16 px-6 bg-blue-500 flex flex-wrap items-center lg:py-0 py-2">
        <div className="flex-1 flex justify-between items-center">
        <h1 className="text-white text-lg">Charta</h1>
        </div>
        <input className="hidden" type="checkbox" id="menu-toggle" />
          <div className="hidden lg:flex lg:items-center lg:w-auto w-full" id="menu">
            <nav>
            <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
              <li><a className="lg:p-4 py-3 px-0 block border-b-2 text-white border-transparent hover:border-indigo-400" href="#">ruben1</a></li>
            </ul>
            </nav>
          </div>
        </header>
       );
    }
}

export default Header