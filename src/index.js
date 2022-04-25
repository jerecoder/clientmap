// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBRrI-nmNq0V4JooyOsQSlS0CeGCVcJZxQ",
    authDomain: "clientmap-b1f1b.firebaseapp.com",
    projectId: "clientmap-b1f1b",
    storageBucket: "clientmap-b1f1b.appspot.com",
    messagingSenderId: "608817167872",
    appId: "1:608817167872:web:6b4498f816b50f2f8562e5",
    measurementId: "G-F9VFEZ3FYF"
};

if (location.hostname === "localhost") {
    config = {
        databaseURL: "http://localhost:4000/firestore"
    };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);