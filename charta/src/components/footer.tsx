import {Component} from 'react';

class Footer extends Component {
    render(){
        return (
            <footer className="footer bg-blue-500 relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center">
                    <div className="sm:w-2/3 text-center py-6">
                        <p className="text-white font-bold mb-2">© 2021 Charta</p>
                    </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;