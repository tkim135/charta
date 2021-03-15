import React, {Component} from 'react';

import firebase from "firebase";
import "firebase/auth";
import 'firebase/firestore';
import '../firebase';
import Button from '@material-ui/core/Button';
import Course from "../data/course";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';



interface RequirementsState {
    courses: Array<Course>;
    loading: boolean;
    reqsNeeded: { [key: string]: number; };
    courseUnits: { [key: string]: number; }; //units user chose when multiple options
    courseWays: { [key: string]: string; }; //ways user chose to fulfill when multiple options
}

interface RequirementsProps {
}

class Requirements extends Component<RequirementsProps, RequirementsState> {

    constructor(props: RequirementsProps) {
        super(props);
        this.state = {courses: [], loading : true, reqsNeeded: {},
        courseUnits : {}, courseWays : {}};
        this.loadCourseIds = this.loadCourseIds.bind(this);
        this.loadCourses = this.loadCourses.bind(this);
        this.checkReqs = this.checkReqs.bind(this);
    }

    async loadCourseIds() {
        this.setState({loading : true});
        const db = firebase.firestore();
        let user = firebase.auth().currentUser;
        const userRef = db.collection('users').doc(user?.uid);
        const doc = await userRef.get();

        if (!doc.exists) return;
        let quarters = doc.data()?.quarters;
        if(!quarters) return;

        //perform for each quarter fetching course ids:
        let courseIds: Array<string> = [];
        let courseUnits : { [key: string]: number; } = {};
        let courseWays : { [key: string]: string; } = {};

        for (var i = 0; i < quarters.length; i++) {

            let path = `users/${user?.uid}/${quarters[i]}`;

            await db.collection(path).get().then( (querySnapshot) => {

                // get the course
                querySnapshot.forEach((doc) =>  {
                    let courseData = doc.data();
                    if(!courseData?.ignore) {
                        let courseId = doc.id;
                        courseIds.push(courseId);
                        courseUnits[courseId] = courseData?.units;
                        courseWays[courseId] = courseData?.ways;
                    }
                })

            }).catch((err) => {
                console.log("error loading courses", err);
            });
        }
        this.setState({ courseUnits : courseUnits });
        this.setState({ courseWays : courseWays });
        this.loadCourses(courseIds);
    }

    async loadCourses(courseIds : Array<string>) {

        const db = firebase.firestore();
        //for each course id fetch and return course:
        let courses: Array<Course> = [];
        for (var j = 0; j < courseIds.length; j++) {
            let courseId = courseIds[j];
            const docRef = db.collection('classes').doc(courseId);

            await docRef.get().then(querySnapshot => {

                const courseElements : any = querySnapshot.data();
                const course = new Course(
                    courseId,
                    courseElements["Codes"],
                    courseElements["Description"],
                    courseElements["GER"],
                    courseElements["Grading Basis"],
                    courseElements["Min Units"],
                    courseElements["Max Units"],
                    courseElements["StudyPartners"],
                    courseElements["Terms"],
                    courseElements["Title"]
                );
                courses.push(course);
            })
            .catch((err) => {
                console.log('Error getting course', err);
            });
        }
        this.setState({ loading : false, courses : courses });
        this.checkReqs();
    }

    async checkReqs() {
        let courses = this.state.courses;

        //ways, think, and writing reqs, doesn't include language req:
        function addReqs() {
            var reqs: { [key: string]: number } = {
                "WAY-FR" : 3,
                "WAY-AQR" : 3,
                "WAY-ER" : 3,
                "WAY-SMA" : 6,
                "WAY-CE" : 2,
                "WAY-ED" : 3,
                "WAY-SI" : 6,
                "WAY-A-II" : 6,
                "Writing 1" : 1,
                "Writing 2" : 1,
                "THINK" : 1
            };
            return reqs;
        }
        var reqsNeeded = addReqs();
        var stillNeeded = addReqs();

        for (var i = 0; i < courses.length; i++) {
            //only if GER in reqs, and only first GER still needed::
            let reqs = courses[i].GER;
            var specifiedWays = (this.state.courseWays[courses[i].id])
            for (var j = 0; j < reqs.length; j++) {
                //make sure to select specified ways by user:
                
                if(stillNeeded[reqs[j]] > 0 && 
                (reqs[j] === specifiedWays || specifiedWays === "" ||
                reqs[j] === "THINK" || reqs[j] === "Writing 1" || reqs[j] === "Writing 2")) { 
                    stillNeeded[reqs[j]] -= this.state.courseUnits[courses[i].id];
                    if (reqs[j] !== "THINK") break; //think can fulfill ways req too, always listed first
                }
            }
        }
        this.setState({ reqsNeeded : stillNeeded, loading : false });

    }


    render() {

        let reqsNeeded = this.state.reqsNeeded;

        return(
            <Container style={{marginTop: "10px"}}>
                <Card>
                   <CardContent>
                <Button style={{marginTop: "10px", marginBottom: "10px"}} onClick={() => this.loadCourseIds()}>
                    Check General Requirements Still Needed
                </Button>
                <div>

                {Object.keys(reqsNeeded).map(function(key){
                    if (reqsNeeded[key] > 0) {
                        if(key === "THINK" || key === "Writing 1" || key === "Writing 2") {
                            return (<div key={key}>{`${key} : ${reqsNeeded[key]}`} class</div>);
                        } else {
                            return (<div key={key}>{`${key} : ${reqsNeeded[key]}`} units</div>);
                        }
                    }
                })}

                </div>
            
                
                   </CardContent>
                   </Card>
                   </Container>
        );
    }
}

export default Requirements;
