import { firebase } from '@firebase/app';
import "firebase/auth";

// Add the Firebase products that you want to use
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDOPu_apH2kYsTUJta6nEWwcNzSRQ2SPQk",
    authDomain: "charta-14a8f.firebaseapp.com",
    projectId: "charta-14a8f",
    storageBucket: "charta-14a8f.appspot.com",
    messagingSenderId: "284451429792",
    appId: "1:284451429792:web:49347e70c72d2e06a098c5",
    measurementId: "G-TTG57Q09ZF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

