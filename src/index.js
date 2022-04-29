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


// MAP
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

async function initMap() {
    geocoder = new google.maps.Geocoder();
    // The location of Uluru
    const pos = await get_lat_lng("Plaza 2730 CABA Argentina");
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: pos
    });
}
//PICKER
let pickerApiLoaded = false;
let oauthToken;
let scope = "https://www.googleapis.com/auth/drive";

function onAuthApiLoad() {
    window.gapi.auth.authorize({
        'client_id': clientID,
        'scope': scope
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

function createPicker() {
    var picker = new google.picker.PickerBuilder()
        .addView(new google.picker.DocsUploadView())
        .addView(new google.picker.DocsView())
        .setOAuthToken(oauthToken)
        .setDeveloperKey(key)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
}

function pickerCallback(data) {
    var url = 'nothing';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        url = doc[google.picker.Document.URL];
    }
    var message = 'You picked: ' + url;
    document.getElementById('result').innerHTML = message;
}


function onApiLoad() {
    gapi.load('auth', { 'callback': onAuthApiLoad });
    gapi.load('picker');
}

function init() {
    initMap();
    onApiLoad();
}

window.addEventListener("load", init);