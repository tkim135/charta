const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.recommendation = functions.https.onRequest((request, response) => {
  recommendations = []
  
  terms = []; 
  units = 0;
  reqs = request.query.reqs.split(','); 

  if (request.query.terms != null) {
    terms = request.query.terms.split(','); 
  }
  if (request.query.units != null && request.query.units > 0) {
    units = request.query.units;
  }

  filterByTerms = terms.length > 0; 
  filterByUnits = units > 0

  return db.collection('classes').where('GER', 'array-contains-any', reqs).get().then(function(courses) {
    courses.forEach((course) => {
        let meetsReq = true;

        if (filterByTerms) {
          let courseTerms = course.data().Terms; 
          let intersection = terms.filter(t => courseTerms.includes(t)); 
          if (intersection.length < 1) {
            meetsReq = false;
            // recommendations.push(course.data()); 
          }
        }   
        if (filterByUnits) {
          let minCourseUnits = course.data()['Min Units']
          let maxCourseUnits = course.data()['Max Units']

          if (units > maxCourseUnits || units < minCourseUnits) {
            meetsReq = false
          }
        } 
        if (meetsReq) {
          recommendations.push(course.data()); 
        }
    }); 
    response.send(recommendations); 
  }); 
}); 