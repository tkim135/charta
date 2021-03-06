import React, {Component} from 'react';
import '../App.css';

import Course from "../data/course";
import Footer from "./footer";
import Grid from "@material-ui/core/Grid";
import Header from "./header";

import firebase from "firebase";
import "firebase/auth";
import 'firebase/firestore';
import '../firebase';

interface StudyState {
	course: Course;
	loading: boolean;
	names: Array<string>;
	emails: Array<string>;
	addedToGroup: boolean;
}

interface StudyProps {
}

class StudyGroups extends Component<StudyProps, StudyState>{

    constructor(props: any) {
    	super(props);
        let course =  new Course("", [], "", [], "", 0, 0, [], [], "");
        this.state = {course: course, loading: true, names: [], emails: [], addedToGroup: false}

        this.loadCourseData = this.loadCourseData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async loadCourseData() {
        let courseId = window.location.pathname.split("/").pop() as any;
        const db = firebase.firestore();
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

            this.setState({ course : course });

            this.setState({ loading : false });

        })
            .catch((err) => {
                console.log('Error getting course', err);
            });

        //fill study group data:
        const userIds = this.state.course.studyPartners;
        if(userIds) {
        	var i;
        	var names = [];
        	var emails = [];
        	for (i = 0; i < userIds.length; i++) {
        		let uid = (userIds[i]);
        		const userRef = db.collection('users').doc(uid);
        		const doc = await userRef.get();
        		names[i] = doc.data()?.firstName;
        		emails[i] = doc.data()?.email;
        	}
        	this.setState({names: names, emails: emails});
        }
    }

    async componentDidMount() {
        await this.loadCourseData();
    }

    async handleChange() {

    	this.setState({addedToGroup: !this.state.addedToGroup});
    	const db = firebase.firestore();
        let uid = firebase.auth().currentUser?.uid;
        let courseId = window.location.pathname.split("/").pop() as any;
        const docRef = db.collection('classes').doc(courseId);
        const doc = await docRef.get();
        var studyPartners = doc.data()?.StudyPartners;
    	
    	if(this.state.addedToGroup) { //add to list
    		//if studypartners field already exists and user not yet added:
        	if(studyPartners && studyPartners.indexOf(uid) === -1) {
        		studyPartners.push(uid);
        		await db.collection("classes").doc(courseId).update({StudyPartners: studyPartners});
        		this.loadCourseData();
        	}
        	
        	//If studyPartners field hasn't been created yet:
        	if(!studyPartners) {
        		studyPartners = [uid];
        		await db.collection("classes").doc(courseId).update({StudyPartners: studyPartners});
        		this.loadCourseData();
        	}

    	} else { //remove from list:
    		//if studypartners field already exists and user in array:
    		if(studyPartners && studyPartners.indexOf(uid) !== -1) {
    			let index = studyPartners.indexOf(uid);
            	studyPartners.splice(index, 1);
    			await db.collection("classes").doc(courseId).update({StudyPartners: studyPartners});
    			this.loadCourseData();
    		}
    	}
    }


    render() {

    	let course = this.state.course;
    	let names = this.state.names;
    	let emails = this.state.emails;

    	return(

			<div className="flex flex-col h-screen justify-between">
				<div className="spacebelow">
					<Header/>
				</div>

				<Grid container direction="column" spacing={8}>
				<Grid container spacing={8} direction="row" justify="space-evenly" alignItems="flex-start">
	
					<Grid item xs={7}>
							<p className="intro">Find study partners!</p>
							<p className="info">{course.title} ({course.codes.join(', ')})</p>
							<p className="description">{course.description}</p>
					</Grid>
					
					<Grid item xs={3}>
						<img src={"../images/study.png"} alt="Students studying"/>
					</Grid>

				</Grid>

				<Grid container spacing={8} direction="row" justify="space-evenly" alignItems="flex-start">
					<Grid item xs={7}>
						<p className="intro">Students looking for partners:</p>

      					<table style={{marginBottom: "20px"}} className="table">
        				<tr className="label">
            				<th style={{padding: "10px"}}>Name</th>
            				<th>Email</th>
          					</tr>
        			 		{names.map((student,i) =>(
                   			<tr key={i}>
              					<td style={{padding: "10px"}}>
                					{student}
              					</td>
              					<td>{emails[i]}</td>
            				</tr>
          					))}
      					</table>
      					<label className="description">
            		<input type="checkbox" defaultChecked={this.state.addedToGroup}
            			onChange={this.handleChange}/> 
            			Add me to the list!
          			</label>
      				</Grid>
      				<Grid item xs={3}>
      				</Grid>
    			</Grid>
    			</Grid>

				<Footer/>
			</div>
        );
    }
}

export default StudyGroups;