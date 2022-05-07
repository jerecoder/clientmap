// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { async } from "@firebase/util";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//local functions: http://localhost:5001/clientmap-b1f1b/us-central1/

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
// MAP
let markers = [];
let exists = {};

async function initMap() {
    geocoder = new google.maps.Geocoder();
    // The location of Uluru
    const pos = {
        lat: 25,
        lng: 135
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: pos
    });
}

async function newMarker(pos, q) {
    new google.maps.Marker({
        position: pos,
        map,
        title: q,
    });
    markers.push(pos);
}

async function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

//TODO: change the sheets api to server side processing

//SHEETS API
async function make(file, filename) {
    let range = "A:Z";
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: file,
        range: range
    }).then(async(response) => {
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
        //make map, then add
        let mapID = null;
        $.ajax({
            method: "POST",
            url: "https://us-central1-clientmap-b1f1b.cloudfunctions.net/makeMap",
            crossDomain: true,
            async: false,
            dataType: "json",
            data: {
                name: filename
            },
            success: function(res) {
                mapID = res.result;
            },
            error: function(res) {
                console.log(res);
            }
        });
        uniq.forEach((ad) => {
            $.ajax({
                method: "POST",
                url: "https://us-central1-clientmap-b1f1b.cloudfunctions.net/addPoint",
                crossDomain: true,
                dataType: "json",
                async: false,
                data: {
                    adress: ad,
                    map: mapID
                },
                success: function(res) {
                    console.log(res);
                },
                error: function(res) {
                    console.log(res, "error");
                }
            });
        });
        if (mapID) {
            console.log(mapID);
            //once all the points are loaded move to individual map website
            window.location.replace(window.location.search + "?id=" + mapID);
            //Document.getElementById("alertas").style.visibility = "hidden";
        }
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
    var name = '';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        name = doc.name;
        url = doc.id;
    }
    make(url, name);
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('id')) {
        console.log("defined id");
        //convert queries
        $.ajax({
            method: "GET",
            url: "https://us-central1-clientmap-b1f1b.cloudfunctions.net/convert",
            crossDomain: true,
            dataType: "json",
            async: false,
            data: {
                map: "urlParams.id"
            },
            success: function(res) {
                console.log(res);
            },
            error: function(res) {
                console.log(res, "error");
            }
        });
        //load already converted database

    }
}

window.addEventListener("load", init);
document.getElementById("crear").addEventListener("click", onApiLoad);