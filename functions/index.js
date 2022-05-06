const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

//only for testing
const cors = require('cors')({ origin: true });

exports.addPoint = functions.https.onRequest(async(req, res) => {
    //add the point to the database
    const adress = req.query.adress;
    const map = req.query.map;
    admin.firestore().collection('maps').doc(map).update({
        data: admin.firestore.FieldValue.arrayUnion(adress)
    }).then((docRef) => {
        res.send("Sucess");
    }).catch((error) => {
        console.log("Error adding document: " + error);
    })
});

exports.makeMap = functions.https.onRequest(async(req, res) => {
    cors(req, res, () => {
        //add the point to the database
        const name = req.body.name;
        admin.firestore().collection('maps').add({
            name: name,
            data: []
        }).then((docRef) => {
            console.log("sucess " + docRef.id);
            res.json({ result: `Message with ID: ${docRef.id} added.` });
        }).catch((error) => {
            console.log("Error adding document: " + error + " " + name);
            res.json({ result: `error feo: ${error}` });
        })
    })
});

exports.getLatLng = functions.https.onRequest(async(req, res) => {
    // Grab the text parameter.
    const original = req.query.adress;
    //TODO: implement id based map
    //const db = req.query.id;
    // Push the new message into Firestore using the Firebase Admin SDK.
    $.ajax({
        type: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address) + "&key=" + key,
        async: !1,
        success: function(data) {
            console.log(data);
            response = data.results[0].geometry.location;
        },
        error: function() {

        }
    });
    // Send back a message that we've successfully written the message
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
});