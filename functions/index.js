const functions = require("firebase-functions");
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

//only for testing
const cors = require('cors')({ origin: true });

exports.makeMap = functions.https.onRequest(async(req, res) => {
    cors(req, res, () => {
        //add the point to the database
        const name = req.body.name;
        admin.firestore().collection('maps').add({
            name: name,
            queries: [],
            coords: []
        }).then((docRef) => {
            console.log("sucess " + docRef.id);
            res.json({ result: docRef.id });
        }).catch((error) => {
            console.log("Error adding document: " + error + " " + name);
            res.json({ result: `error feo: ${error}` });
        });
    });
});

exports.addPoint = functions.https.onRequest(async(req, res) => {
    cors(req, res, () => {
        //add the point to the database
        const adress = req.body.adress;
        const map = req.body.map;
        admin.firestore().collection('maps').doc(map).update({
            queries: admin.firestore.FieldValue.arrayUnion(adress)
        }).then(() => {
            res.json({ response: "good job!" });
        }).catch((error) => {
            console.log("Error adding document: " + error);
        });
    });
});


exports.convert = functions.https.onRequest(async(req, res) => {
    cors(req, res, () => {
        const key = process.env.API_KEY;
        console.log(process.env.nombre);
        /*
        //fetch adresses
        const map = req.body.map;
        const mapdoc = admin.firestore().collection('maps').doc(map);
        let coords = [];
        let queries = [];
        //make geocoding queries
        mapdoc.get().then((doc) => {
            if (doc.exists) {
                queries = doc.data().queries;
                console.log(queries);
            } else {
                // doc.data() will be undefined in this case
                res.json({ response: "NO.DOCUMENT" });
            }
        }).then(() => {
            queries.forEach((q) => {
                axios.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(q) + "&key=" + key).then(res => {
                    console.log(res.data);
                    //console.log(data.results[0].geometry.location);
                    //coords.push(data.results[0].geometry.location);
                }).catch(error => {
                    console.log(error);
                })
            });
            admin.firestore().collection('maps').doc(map).update({
                coords: coords
            }).then(() => {
                res.json({ response: coords });
            }).catch((error) => {
                res.json({ response: "couldn't add coords" });
            });
        }).catch((error) => {
            console.log(error);
            res.json({ response: "NO.GET.DOCUMENT" });
        });*/
    });
});