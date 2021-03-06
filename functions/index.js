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

exports.recommendation = functions.https.onCall((data, context) => {
  // all recommendations that will be returned

  // query database on GER requirements
  return new Promise((resolve, reject) => {
    var recommendations = {}
  
    // parameters passed to query
    terms = []; 
    units = 0;

    if (data.reqs != null) {
      reqs = data.reqs.split(','); 
    }
    // some post-processing to params passed to query 
    if (data.terms != null) {
      terms = data.terms.split(','); 
    }
    if (data.units != null && data.units > 0) {
      units = data.units;
    }
  
    filterByTerms = terms.length > 0; 
    filterByUnits = units > 0
    db.collection('classes').where('GER', 'array-contains-any', reqs)
      .get()
      .then(courses => {
        courses.forEach(course => {
          let meetsReq = true; 

          if (filterByTerms) {
            let courseTerms = course.data().Terms; 
            let intersection = terms.filter(t => courseTerms.includes(t)); 
            if (intersection.length < 1) {
              meetsReq = false;
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
            key = course.id
            var courseData = course.data()
            recommendations[key] = courseData
          } 
        })
        var recommendationsStr = JSON.stringify(recommendations, null, '\t'); 
        // console.log(recommendationsStr)
        resolve(recommendations)
      })

  })

});   