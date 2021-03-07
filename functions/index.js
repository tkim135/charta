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
    var recommendations = []
  
    // parameters passed to query
    terms = []; 
    units = 0;
    reqs = []
    keywords = []

    if (data.reqs != null) {
      reqs = data.reqs.split(','); 
    } 
    // some post-processing to params passed to query 
    if (data.terms != null) {
      terms = data.terms.split(','); 
    }
    if (data.units != null && data.units > 0) {
      units = data.units.split(',');
    }
  
    if (data.keywords != null && data.keywords.length > 0) {
      keywords = data.keywords.split(';')
    }

    filterByTerms = terms.length > 0; 
    filterByUnits = units > 0
    filterByKeywords = keywords.length > 0;

    if (reqs.length > 0) {
      db.collection('classes').where('GER', 'array-contains-any', reqs)
        .get()
        .then(courses => {
          courses.forEach(course => {
            let meetsReq = true; 

            if (filterByTerms) {
              let foundMatch = false
              let courseTerms = course.data().Terms; 
              
              for (var i=0; i<terms.length; i++){
                term = terms[i]
                let termMatches = courseTerms.find(t => t.includes(term))
                console.log(termMatches)
                if (termMatches != undefined) {
                  foundMatch = true; 
                  break; 
                }
              }
              if (!foundMatch) {
                meetsReq = false; 
              }
              
              // let intersection = terms.filter(t => courseTerms.includes(t)); 
              // if (intersection.length < 1) {
              //   meetsReq = false;
              // }
            }

            if (filterByUnits) {
              let minCourseUnits = course.data()['Min Units']
              let maxCourseUnits = course.data()['Max Units']
              
              matchedUnits = units.filter(function(unit) {
                return parseInt(unit) >= minCourseUnits && parseInt(unit) <= maxCourseUnits
              })

              if (matchedUnits.length == 0) {
                meetsReq = false
              }
            }

            if (filterByKeywords) {
              foundMatch = false; 
              let courseTitle = course.data().Codes.toString().toLowerCase(); 
              let courseDescription = course.data().Description.toLowerCase(); 
              let courseInfo = courseTitle + " " + courseDescription

              keywords.forEach(keyword => {
                if (courseInfo.includes(keyword)){
                  foundMatch = true
                }
              })

              if (!foundMatch) {
                meetsReq = false 
              }
            }

            if (meetsReq) {
              // key = course.id
              // var courseData = course.data()
              // recommendations[key] = courseData
              var courseData = course.data()
              courseData["id"] = course.id
              recommendations.push(courseData)
            } 
          })
          var recommendationsStr = JSON.stringify(recommendations, null, '\t'); 
          // console.log(recommendationsStr)
          resolve(recommendations)
        })
        .catch(reason => {
          console.log('db.collection("classes").get gets err, reason: ' + reason);
          reject(reason);
      });
    } else {
      db.collection('classes')
        .get()
        .then(courses => {
          courses.forEach(course => {
            let meetsReq = true; 

            if (filterByTerms) {
              let foundMatch = false
              let courseTerms = course.data().Terms; 
              
              for (var i=0; i<terms.length; i++){
                term = terms[i]
                let termMatches = courseTerms.find(t => t.includes(term))
                console.log(termMatches)
                if (termMatches != undefined) {
                  foundMatch = true; 
                  break; 
                }
              }
              if (!foundMatch) {
                meetsReq = false; 
              }
              // let courseTerms = course.data().Terms; 
              // let intersection = terms.filter(t => courseTerms.includes(t)); 
              // if (intersection.length < 1) {
              //   meetsReq = false;
              // }
            }

            if (filterByUnits) {
              let minCourseUnits = course.data()['Min Units']
              let maxCourseUnits = course.data()['Max Units']
              
              matchedUnits = units.filter(function(unit) {
                return parseInt(unit) >= minCourseUnits && parseInt(unit) <= maxCourseUnits
              })

              if (matchedUnits.length == 0) {
                meetsReq = false
              }
            }

            if (filterByKeywords) {
              foundMatch = false; 
              let courseTitle = course.data().Codes.toString().toLowerCase(); 
              let courseDescription = course.data().Description.toLowerCase(); 
              let courseInfo = courseTitle + " " + courseDescription

              keywords.forEach(keyword => {
                console.log(keywords)
                if (courseInfo.includes(keyword)){
                  console.log(keyword, courseInfo)
                  foundMatch = true
                }
              })

              if (!foundMatch) {
                meetsReq = false 
              }
            }

            if (meetsReq) {
              // key = course.id
              // var courseData = course.data()
              // recommendations[key] = courseData
              
              var courseData = course.data()
              courseData["id"] = course.id
              recommendations.push(courseData)
            } 
          })
          // var recommendationsStr = JSON.stringify(recommendations, null, '\t'); 
          // console.log(recommendationsStr)
          resolve(recommendations)
        })
        .catch(reason => {
          console.log('db.collection("classes").get gets err, reason: ' + reason);
          reject(reason);
      });
    }
  })

});   