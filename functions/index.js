const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const mapper = require('./unique_words_dict2.json')

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
    var ids = []
    // parameters passed to query
    terms = []; 
    units = 0;
    gers = []
    keywords = []
    keywordHits = []
    coursesWithKeywords = []
    start = 0
    numResults = 25

    if (data.start != null){
      start = data.start
    }

    if (data.numResults != null) {
      numResults = data.numResults
    }

    if (data.gers != null) {
      console.log(data.gers)
      gers = data.gers; 
    } 
    // some post-processing to params passed to query 
    if (data.terms != null) {
      terms = data.terms; 
    }
    if (data.units != null && data.units > 0) {
      units = data.units;
    }
  
    if (data.keywords != null && data.keywords.length > 0) {
      keywords = data.keywords.split(' ')
    }

    filterByTerms = terms.length > 0; 
    filterByUnits = units > 0
    filterByKeywords = keywords.length > 0;
    filterByGers = gers.length > 0 

    if (filterByKeywords){
      unique_words = Object.keys(mapper)
      hits = []
      
      // unique_words.forEach(word => {
      //   if (word.toLowerCase().includes(keywords)) {
      //     hits = hits.concat(mapper[word])
      //   }
      // })
      keywords.forEach(kw => {
        hitsKeys = unique_words.filter(word => word.includes(kw))
        hitsKeys.forEach(key => {
          hits = hits.concat(mapper[key])
        })  
      })
      
      // change to start and numbatch
      hits = [...new Set(hits)].slice(0, start+25)
      
      hits.forEach(hit => {
        let promise = db.collection('classes').doc(hit).get().then(course => {
          let meetsReq = true

          if (filterByTerms) {
            let foundMatch = false
            let courseTerms = course.data().Terms; 
              
            for (var i=0; i<terms.length; i++){
                term = terms[i]
                let termMatches = courseTerms.find(t => t.includes(term))
                // console.log(termMatches)
                if (termMatches != undefined) {
                  foundMatch = true; 
                  break; 
                }
              }
              if (!foundMatch) {
                meetsReq = false; 
              }  
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

          if (filterByGers) {
            let courseGERs= course.data.gers()
            let intersection = gers.filter(g => courseGERs.includes(g))
            if (intersection.length == 0) {
              meetsReq = false
            }
          }
          if (meetsReq) {
            var courseData = course.data()
            courseData["id"] = course.id
            return courseData
          }
        }).catch(err => {
          console.log("error: ", err)
        })
        recommendations.push(promise)
      })
      Promise.all(recommendations).then(resolve)
    } else {
        db.collection('classes').limit(300)
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
                // console.log(termMatches)
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
                // console.log(keywords)
                if (courseInfo.includes(keyword)){
                  // console.log(keyword, courseInfo)
                  foundMatch = true
                }
              })

              if (!foundMatch) {
                meetsReq = false 
              }
            }

            if (filterByGers) {
              let courseGERs= course.data.gers()
              let intersection = gers.filter(g => courseGERs.includes(g))
              if (intersection.length == 0) {
                meetsReq = false
              }
            }

            if (meetsReq) {
              var courseData = course.data()
              courseData["id"] = course.id
              recommendations.push(courseData)
            } 
          })
          resolve(recommendations)
        })
        .catch(reason => {
          console.log('db.collection("classes").get gets err, reason: ' + reason);
          reject(reason);
      });
    }


    // } else {
    //   db.collection('classes').limit(300)
    //     .get()
    //     .then(courses => {
    //       courses.forEach(course => {
    //         let meetsReq = true; 

    //         if (filterByTerms) {
    //           let foundMatch = false
    //           let courseTerms = course.data().Terms; 
              
    //           for (var i=0; i<terms.length; i++){
    //             term = terms[i]
    //             let termMatches = courseTerms.find(t => t.includes(term))
    //             // console.log(termMatches)
    //             if (termMatches != undefined) {
    //               foundMatch = true; 
    //               break; 
    //             }
    //           }
    //           if (!foundMatch) {
    //             meetsReq = false; 
    //           }
    //           // let courseTerms = course.data().Terms; 
    //           // let intersection = terms.filter(t => courseTerms.includes(t)); 
    //           // if (intersection.length < 1) {
    //           //   meetsReq = false;
    //           // }
    //         }

    //         if (filterByUnits) {
    //           let minCourseUnits = course.data()['Min Units']
    //           let maxCourseUnits = course.data()['Max Units']
              
    //           matchedUnits = units.filter(function(unit) {
    //             return parseInt(unit) >= minCourseUnits && parseInt(unit) <= maxCourseUnits
    //           })

    //           if (matchedUnits.length == 0) {
    //             meetsReq = false
    //           }
    //         }

    //         if (filterByKeywords) {
    //           foundMatch = false; 
    //           let courseTitle = course.data().Codes.toString().toLowerCase(); 
    //           let courseDescription = course.data().Description.toLowerCase(); 
    //           let courseInfo = courseTitle + " " + courseDescription

    //           keywords.forEach(keyword => {
    //             // console.log(keywords)
    //             if (courseInfo.includes(keyword)){
    //               // console.log(keyword, courseInfo)
    //               foundMatch = true
    //             }
    //           })

    //           if (!foundMatch) {
    //             meetsReq = false 
    //           }
    //         }

    //         if (meetsReq) {
    //           // key = course.id
    //           // var courseData = course.data()
    //           // recommendations[key] = courseData
              
    //           var courseData = course.data()
    //           courseData["id"] = course.id
    //           recommendations.push(courseData)
    //         } 
    //       })
    //       // var recommendationsStr = JSON.stringify(recommendations, null, '\t'); 
    //       // console.log(recommendationsStr)
    //       resolve(keywordHits)
    //     })
    //     .catch(reason => {
    //       console.log('db.collection("classes").get gets err, reason: ' + reason);
    //       reject(reason);
    //   });
    // }
  })

});   


