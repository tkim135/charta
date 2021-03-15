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
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
    newWays: string;
    newGrade: string;
    newReason: string;
    courseAlreadyAdded: boolean;
    invalidUnits: boolean;
    invalidCode: boolean;
    invalidWays: boolean;
    invalidQuarter: boolean;
    addCourseSuccess: boolean;
    addCourseFailure: boolean;
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
            newGrade: '', newReason: '', newWays: '', courseAlreadyAdded: false,
            invalidUnits: false, invalidCode: false, invalidQuarter: false, invalidWays: false,
            addCourseSuccess: false, addCourseFailure: false};
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
        if (this.state.newQuarter == '') {
            this.setState({invalidQuarter: true});
            return;
        }
        if (this.state.newCode == '') {
            this.setState({invalidCode: true});
            return;
        }
        if (Number.isNaN(this.state.newUnits)
            || this.state.newUnits < this.props.course.minUnits
            || this.state.newUnits > this.props.course.maxUnits) {
                this.setState({invalidUnits: true});
                return;
        }

        if ((this.state.newWays) !== "" && !(this.props.course.GER.indexOf(this.state.newWays) > -1)) {
            console.log("Class can't fulfill inputted WAYS!");
            this.setState({invalidWays: true});
            return;
        }

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
                        let course = new UserCourse(courseData?.code, courseData?.reason,
                            courseData?.grade, courseData?.units, courseData?.ways, scope.state.newQuarter, courseData?.title, doc.id);
                        quarterCourses.push(course);
                        console.log(course);
                    })
                }).catch((err) => {
                    console.log("error loading courses", err);
                });
                // check if requested quarter already contains course
                let quarterCourseIds = quarterCourses.map(course => course.id);
                if (quarterCourseIds.includes(scope.props.course.id)) {
                    scope.setState({courseAlreadyAdded: true});
                    return;
                }
                // now add to database if all of these safety checks pass
                db.collection(`users/${user?.uid}/${scope.state.newQuarter}`)
                    .doc(scope.props.course.id).set({
                    "units": scope.state.newUnits,
                    "grade": scope.state.newGrade,
                    "reason": scope.state.newReason,
                    "ways": scope.state.newWays,
                    "id": scope.props.course.id,
                    "title": scope.props.course.title,
                    "code": scope.state.newCode
                }).then(() => {
                    console.log("added course");
                    scope.setState({addCourseSuccess: true});
                }).catch((error) => {
                    console.log(error.code, error.message);
                    scope.setState({addCourseFailure: true});
                    return;
                });
            } else {
              user = null;
            }
            scope.closeDialog();
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
                    return <Chip color="primary" label={GER} key={i} style={{margin: "2px"}}/>
                }) : <span>None</span> }


                <br/>
            
                Grading: {course.gradingBasis}


        
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            > <h1>Terms Offered</h1>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Container>
                                        {course.terms.map((Term: string, i: number) => {
                                        return <Chip color="primary" label={Term} key={i} style={{margin: "2px"}}/>
                                    }) }

                                </Container>

                            
        

                            </AccordionDetails>
                        </Accordion>
                  

            </CardContent>

            <CardActions>
                    <Button size="small" ><Link to={'/studygroups/' + course.id }>Find study groups</Link></Button>
                    <Button size="small" onClick={() => this.openDialog()}>Add to academic plan <AddCircleIcon/></Button>
            </CardActions>
            {(this.state.availableQuartersToTake.length > 0) && <Dialog open={this.state.addingCourse}>
                <DialogTitle>Add course to academic plan</DialogTitle>
                <DialogContent>
                    <b>{course.title} ({course.codes.join(', ')})</b>
                    <TextField
                        autoFocus
                        required
                        select
                        error={!course.codes.includes(this.state.newCode)}
                        margin="dense"
                        id="name"
                        label="Select code to add"
                        type="text"
                        value={this.state.newCode}
                        onChange={(evt) => this.setState({newCode: evt.target.value})}
                        fullWidth
                    >
                        {course.codes.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        autoFocus
                        required
                        select
                        error={!this.state.availableQuartersToTake.includes(this.state.newQuarter)}
                        margin="dense"
                        id="name"
                        label="Select quarter to add to"
                        type="text"
                        value={this.state.newQuarter}
                        onChange={(evt) => this.setState({newQuarter: evt.target.value})}
                        fullWidth
                    >
                        {this.state.availableQuartersToTake.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                            required
                            autoFocus
                            error={Number.isNaN(this.state.newUnits) || this.state.newUnits < 0 || this.state.newUnits > 10}
                            margin="dense"
                            id="units"
                            label="Units"
                            type="number"
                            // give current value as default value; this helps the user know
                            // what the current value is in case the value isn't updated from last time
                            value={this.state.newUnits}
                            onChange={(evt) => this.setState({newUnits: parseInt(evt.target.value)})}
                            fullWidth
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="ways"
                        label="WAYS Fulfilling (e.g., WAY-SI)"
                        type="text"
                        value={this.state.newWays} // give current value as default value
                        onChange={(evt) => this.setState({newWays: evt.target.value})}
                        fullWidth
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.closeDialog()} color="primary" className="cancelButton">
                        Cancel
                    </Button>

                    <Button onClick={() => this.addCourse()} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>}
            <Snackbar onClose={() => this.setState({noAvailableQuarter: false})}
            open={this.state.noAvailableQuarter} autoHideDuration={2000}>
                <MuiAlert severity="warning">
                    Sorry... there are no available quarters in your planner where you can add the course
                </MuiAlert>
            </Snackbar>
            <Snackbar onClose={() => this.setState({courseAlreadyAdded: false})} open={this.state.courseAlreadyAdded} autoHideDuration={2000}>
                <MuiAlert severity="warning">
                    Sorry... the course already exists in that quarter!
                </MuiAlert>
            </Snackbar>
            <Snackbar onClose={() => this.setState({invalidQuarter: false})} open={this.state.invalidQuarter} autoHideDuration={2000}>
                <MuiAlert severity="warning">
                    Sorry... please specify a valid quarter
                </MuiAlert>
            </Snackbar>
            <Snackbar onClose={() => this.setState({invalidCode: false})} open={this.state.invalidCode} autoHideDuration={2000}>
                <MuiAlert severity="warning">
                    Sorry... please specify a valid course code
                </MuiAlert>
            </Snackbar>
            <Snackbar onClose={() => this.setState({invalidUnits: false})} open={this.state.invalidUnits} autoHideDuration={2000}>
                <MuiAlert severity="warning">
                    Sorry... please specify a valid number of units
                </MuiAlert>
            </Snackbar>
            <Snackbar onClose={() => this.setState({invalidWays: false})} open={this.state.invalidWays} autoHideDuration={2000}>
                <MuiAlert severity="warning">
                    Sorry... please specify a valid ways to fulfill
                </MuiAlert>
            </Snackbar>

            {/* when class added successfully */}
            <Snackbar onClose={() => this.setState({addCourseSuccess: false})} open={this.state.addCourseSuccess} autoHideDuration={2000}>
                <MuiAlert severity="success">
                    Class added! 😃
                </MuiAlert>
            </Snackbar>
            {/* general error case of failure beyond the safety checks above */}
            <Snackbar onClose={() => this.setState({addCourseFailure: false})} open={this.state.addCourseFailure} autoHideDuration={2000}>
                <MuiAlert severity="warning">
                    Sorry... something went wrong 🥴
                </MuiAlert>
            </Snackbar>
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