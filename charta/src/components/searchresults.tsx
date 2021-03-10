import { RouteComponentProps, withRouter } from 'react-router';
import React, {Component} from 'react';
import firebase from "firebase";
import 'firebase/firestore';
import '../firebase';
import Course from "../data/course";
import Header from "./header";
import Footer from "./footer";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import UserCourse from '../data/usercourse';
import {Link} from 'react-router-dom';
import { MenuItem } from '@material-ui/core';

interface SearchResultState {
    course: Course,
    courseLoading: boolean,
    quartersLoading: boolean,
    userQuarters: Array<string>;
}

interface SearchResultProps {
}

interface CourseCardState {
    addingCourse: boolean;
    noAvailableQuarter: boolean;
    newCode: string;
    newQuarter: string;
    availableQuartersToTake: Array<string>;
    newUnits: number;
    newGrade: string;
    newReason: string;
    courseAlreadyAdded: boolean;
    invalidUnits: boolean;
    invalidCode: boolean;
    invalidQuarter: boolean;
}

interface CourseCardProps {
    course: Course,
    userQuarters: Array<string>;
}


class CourseCard extends Component<CourseCardProps, CourseCardState>{

    constructor(props: CourseCardProps) {
        super(props);
        this.state = {addingCourse: false, newCode: '', newQuarter: '',
            noAvailableQuarter: false, availableQuartersToTake: [], newUnits: 0,
            newGrade: '', newReason: '', courseAlreadyAdded: false,
            invalidUnits: false, invalidCode: false, invalidQuarter: false};
    }

    async openDialog() {
        console.log('Opening dialog!');
        let convertedQuarters = this.props.course.terms.map((quarter: string) => {
            // convert to user quarter format
            let season = quarter.substring(10);
            if (season == "Autumn") {
                return "Fall " + quarter.substring(0,4);
            }
            return season + ' ' + quarter.substring(5,9);
        });
        let availableQuartersToTake = convertedQuarters.filter(
            quarter => {
                return this.props.userQuarters.includes(quarter);
            }
        );
        this.setState({availableQuartersToTake: availableQuartersToTake});
        if (availableQuartersToTake.length == 0) {
            this.setState({noAvailableQuarter: true});
        } else {
            this.setState({noAvailableQuarter: false});
        }
        this.setState({addingCourse: true});
    }

    async closeDialog() {
        console.log('Closing dialog!');
        this.setState({addingCourse: false});
    }

    async addCourse() {
        let scope = this;
        firebase.auth().onAuthStateChanged(async function(user)  {
            if (user) {
                const db = firebase.firestore();

                // get current courses in the given quarter
                let quarterCourses: Array<UserCourse> = [];

                // iterate over courses in this quarter
                await db.collection(`users/${user?.uid}/${scope.state.newQuarter}`).get().then( (querySnapshot) => {
                    console.log(scope.state.newQuarter);

                     // get the course
                     querySnapshot.forEach((doc) =>  {
                        // let course = await this.loadCourse(doc);
                        let courseData = doc.data();
                        if(courseData?.ignore) return
                        let course = new UserCourse(courseData?.code, courseData?.reason, courseData?.grade, courseData?.units, scope.state.newQuarter, courseData?.title, doc.id);
                        quarterCourses.push(course);
                        console.log(course);
                    })
                }).catch((err) => {
                    console.log("error loading courses", err);
                });
                console.log(quarterCourses);

                let uid = firebase.auth().currentUser?.uid;
            } else {
              user = null;
            }
        });
    }

    render() {
        let course = this.props.course;

        return (
            <Card>
            <CardContent>
                <h1>{course.title} ({course.codes.join(', ')})</h1>

                <p>{course.description}</p>

                Units: {course.minUnits === course.maxUnits ? <span>{course.maxUnits}</span> : <span>{course.minUnits}-{course.maxUnits}</span>}

                <br/>

                GER: {course.GER[0] ? course.GER.map((GER: string, i: number) => {
                    return <Chip color="primary" label={GER} key={i}/>
                }) : <span>None</span> }

                <br/>

                {course.terms.map((term: string, i: number) => {
                    // change background color to be less harsh for the eye
                    return <Chip color="secondary" style={{backgroundColor:'#ba5a00'}}
                            label={term} key={i}/>
                }) }

                <Chip label={course.gradingBasis}/>


            </CardContent>

            <CardActions>
                    <Button size="small" ><Link to={'/studygroups/' + course.id }>Find study groups</Link></Button>
                    <Button size="small">Add to academic plan <AddCircleIcon/></Button>
                    <Button size="small">Find similar classes</Button>
            </CardActions>
        </Card>
        );
    }


}

class SearchResults extends Component<SearchResultProps & RouteComponentProps, SearchResultState> {

    constructor(props: any) {
        super(props);
        let course =  new Course("", [], "", [], "", 0, 0, [], [], "");
        this.state = {course: course, courseLoading: true, quartersLoading: true, userQuarters: []}

        this.loadCourseData = this.loadCourseData.bind(this);
    }

    async componentWillReceiveProps(nextProps: any) {
        await this.loadCourseData();
        await this.loadQuarters();
        console.log('url changes');
    }

    async loadQuarters() {
        // hack around promise context
        let scope = this;
        firebase.auth().onAuthStateChanged(async function(user)  {
            if (user) {
                const db = firebase.firestore();
                const userRef = db.collection('users').doc(user?.uid);
                const doc = await userRef.get();

                let quarters = doc.data()?.quarters;

                if(quarters) {
                    scope.setState({userQuarters: quarters});
                }

                else {
                    scope.setState({userQuarters: []});
                }

            } else {
              user = null;
            }
          });
        this.setState({ quartersLoading : false });
    }

    // this.props.match doesn't update when the url changes, but window.location.pathname does
    async loadCourseData() {
        // const courseId = (this.props.match.params as any).courseId;
        let courseId = window.location.pathname.split("/").pop() as any;
        const db = firebase.firestore();
        const docRef = db.collection('classes').doc(courseId);

        docRef.get().then(querySnapshot => {

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
            this.setState({ courseLoading : false });

        })
            .catch((err) => {
                console.log('Error getting course', err);
            });

    }

    async componentDidMount() {
        await this.loadCourseData();
        await this.loadQuarters();
    }

    render() {

        let course = this.state.course;
        let userQuarters = this.state.userQuarters;
        return (
            <div className="flex flex-col h-screen justify-between">

                <Header/>

                <Container>
                    <Grid container spacing={3} justify='center'>
                        <Grid item>
                            {(this.state.courseLoading || this.state.quartersLoading) ? <CircularProgress/> :
                                <CourseCard course={course} userQuarters={userQuarters}/>}

                        </Grid>

                    </Grid>
                </Container>





                <Footer/>
            </div>
        );
    }
}

export default withRouter(SearchResults);