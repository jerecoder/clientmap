const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
admin.initializeApp();

const secretManagerServiceClient = new SecretManagerServiceClient();
const name = 'projects/608817167872/secrets/workflow/versions/latest';
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
            latlng: []
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
    cors(req, res, async() => {
        const [apikey] = await secretManagerServiceClient.accessSecretVersion({ API_KEY });
        res.json({ response: apikey });
        /*//add the point to the database
        const map = req.body.map;
        const queries = admin.firestore().collection('maps').doc(map).queries;
        //make geocoding queries
        queries.forEach((q) => {
            $.ajax({
                type: "GET",
                url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(q) + "&key=AIzaSyDLSEV6LDZulCRY-9jdP760cq80PcXQOuw",
                async: false,
                success: function(data) {
                    response = data.results[0].geometry.location;
                },
                error: function() {
                    res.json({ response: "couldn't fetch geocoding" })
                    alert('Error occured');
                }
            });
        });
        admin.firestore().collection('maps').doc(map).update({
            queries: admin.firestore.FieldValue.arrayUnion(adress)
        }).then(() => {
            res.json({ response: "good job!" });
        }).catch((error) => {
            console.log("Error adding document: " + error);
        });*/
    });
});