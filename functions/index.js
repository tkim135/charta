const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


// exports.recommendation = functions.https.onRequest((request, response) => {
//     // functions.logger.info("Hello logs!", {structuredData: true});
//     // response.send("Hello from Firebase!");
//
//
//     return {"recommendcourse": "CS110"}
// });


/*

const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
exports.checkEligibility = functions.https.onCall((request, response) => {
  db.collection("test").doc().set({location: request.location, age: request.age}).then(() =>
        console.log("successfully updated database")
    ).catch(console.error());

    return {"eligible": "true"}
});




 */