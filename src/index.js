// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
    apiKey: "AIzaSyBRrI-nmNq0V4JooyOsQSlS0CeGCVcJZxQ",
    authDomain: "clientmap-b1f1b.firebaseapp.com",
    projectId: "clientmap-b1f1b",
    storageBucket: "clientmap-b1f1b.appspot.com",
    messagingSenderId: "608817167872",
    appId: "1:608817167872:web:6b4498f816b50f2f8562e5",
    measurementId: "G-F9VFEZ3FYF"
};

// Initialize 
const app = initializeApp(firebaseConfig);
const key = "AIzaSyBf8QJr96TN4RwSEsnEghuHlsVUQHpzhic";
const clientID = "755477234112-o6g6u940a6sok5dsvkd8idpp48h91h8u.apps.googleusercontent.com";
const clientSecret = "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";
let geocoder, map;

if (location.hostname === "localhost") {
    firebaseConfig = {
        databaseURL: "http://localhost:4000/firestore"
    };
}

function get_lat_lng(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, (results, status) => {
            if (status === 'OK') {
                resolve(results[0].geometry.location);
            } else {
                reject(status);
            }
        });
    });
}

// Initialize and add the map
async function initMap() {
    geocoder = new google.maps.Geocoder();
    // The location of Uluru
    const pos = await get_lat_lng("Plaza 2730 CABA Argentina");
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: pos
    });
}

function onApiLoad() {
    gapi.load('auth2', onAuthApiLoad);
    gapi.load('picker', onPickerApiLoad);
}

function init() {
    initMap();
    onApiLoad();
}

window.addEventListener("load", init);