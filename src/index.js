// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { async } from "@firebase/util";
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
let geocoder, map, tokenClient, gisInited, gapiInited;

if (location.hostname === "localhost") {
    firebaseConfig = {
        databaseURL: "http://localhost:4000/firestore"
    };
}

// MAP
let markers = [];
let exists = {};

async function get_lat_lng(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                resolve("timeout");
            } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                resolve("null");
            } else if (status === 'OK') {
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

async function newMarker(pos) {
    new google.maps.Marker({
        position: pos,
        map,
        title: "point",
    });
    markers.push(pos);
}

async function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

//SHEETS API
async function graph(file) {
    let accessToken = gapi.auth.getToken().access_token;
    let range = "A:C";
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: file,
        range: range
    }).then(async(response) => {
        var result = response.result;
        var numRows = result.values ? result.values.length : 0;
        var values = response.result.values;
        let points = [];
        if (values.length >= 1) document.getElementById("alertas").style.visibility = "visible";
        for (let i = 1; i < values.length; i++) {
            let q = "";
            for (let j = 0; j < values[i].length; j++) {
                q += values[i][j];
                q += " ";
            }
            if (exists[q] == undefined) points.push(q);
        }
        let uniq = [...new Set(points)];
        let errors = [];
        let m = 500;
        let begin = performance.now();
        for (let index = 0; index < uniq.length; index++) {
            let pos = await get_lat_lng(uniq[index]);
            if (pos != "null" && pos != "timeout") {
                newMarker(pos);
            } else {
                let cm = m;
                while (pos == "timeout") {
                    cm = cm * 2;
                    await delay(cm);
                    pos = await get_lat_lng(uniq[index]);
                }
                if (pos != "null") {
                    newMarker(pos);
                    console.log(cm);
                    m = m * 1.1;
                }
                errors.push(uniq[index]);
            }
            let p = index / uniq.length;
            document.getElementById("numero").style.width = (p * 100).toString() + "%";
            let speed = (index + 1) / ((performance.now() - begin) / 1000);
            await delay(m);
            console.log(m);
        }
        console.log((begin - performance.now()) / 60000);
        errors.forEach(element => {
            console.log(element);
        });
        if (values.length >= 1) document.getElementById("alertas").style.visibility = "hidden";
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
        url = doc.id;
    }
    graph(url);
}

//init
function onApiLoad() {
    gapi.load('auth', { 'callback': onAuthApiLoad });
    gapi.load('picker');
    gapi.load("client", () => {
        gapi.client.load("sheets", "v4", () => {});
    });
}

function init() {
    initMap();
}

window.addEventListener("load", init);
document.getElementById("crear").addEventListener("click", onApiLoad);