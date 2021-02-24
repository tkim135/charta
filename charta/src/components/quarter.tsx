import {Component} from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import firebase from "firebase";
import 'firebase/firestore'
import '../firebase';
import UserCourse from '../data/usercourse';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

interface QuarterState {
    open: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    courses: Array<UserCourse>;
    newCourse: string;
    newTitle: string;
    newUnits: number;
    newGrade: string;
    newReason: string;
    totalUnits: number;
    success: boolean;
    failure: boolean
}
interface QuarterProps {
    name: string
}
class Quarter extends Component<QuarterProps, QuarterState> {


    // load the courses for this quarter
   async loadCourses(path: string) {
       const db = firebase.firestore();
       console.log("loading course data");

       // let courses: Array<UserCourse> = [];
       let totalUnits = 0;
       let courses: Array<UserCourse> = [];

       // iterate over courses in this quarter
       db.collection(path).get().then( (querySnapshot) => {
           console.log(path);

            // get the course
            querySnapshot.forEach((doc) =>  {
               // let course = await this.loadCourse(doc);
               let courseData = doc.data();
               if(courseData?.ignore) return
               let course = new UserCourse(courseData?.code, courseData?.reason, courseData?.grade, courseData?.units, this.props.name, courseData?.title)
               courses.push(course);
               totalUnits += course.units;
           })

           this.setState({courses: courses});
           this.setState({totalUnits: totalUnits});


       }).catch((err) => {
           console.log("error loading courses", err);
       });




   }

    async componentDidMount() {
        const db = firebase.firestore();
        let user = firebase.auth().currentUser;
        const userRef = db.collection('users').doc(user?.uid);
        const userData = await userRef.get();

        if (!userData.exists) {
            console.log('User data could not be found');
        } else {
            await this.loadCourses(`users/${user?.uid}/${this.props.name}`);
        }

    }


    constructor(props: QuarterProps) {
        super(props);

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addCourse = this.addCourse.bind(this);
        this.loadCourses = this.loadCourses.bind(this);

        this.state = {open: false,
                   onClick: this.handleOpen,
                   courses: [],
                 newCourse: '',
                  newTitle: '',
                  newGrade: '',
                  newUnits: 0,
                 newReason: '',
                totalUnits: 0,
                  success: false,
                 failure: false
                    };

    }


    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }



    //TODO: case when mulitple course ids
    async findCourse() {
        const db = firebase.firestore();
        const coursesRef = await db.collection('classes');

        let courseId = "-1";
        let courseTitle = "";

        await coursesRef.where('Codes', 'array-contains', this.state.newCourse.toUpperCase()).get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log("nothing found");

                } else {
                    let courseIds: Array<string> = [];
                    let courseTitle = "";

                    querySnapshot.docs.forEach(doc => {
                        console.log(doc.data());
                        courseIds.push(doc.id);
                        courseTitle = doc.data().Title;
                    });

                    if(courseIds.length != 0) {
                        courseId = courseIds[0];

                    }
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });

        return [courseId, courseTitle];
    }



    // TODO: Check if course already in quarter
    // TODO: Check if units are valid (i.e., not possible to take CS 229 for 10 units, even though it should be)
    async addCourse() {

        const db = firebase.firestore();
        let uid = firebase.auth().currentUser?.uid;
        let [courseId, courseTitle] = await this.findCourse();

        console.log(courseId);
        console.log(courseTitle);

        if(courseId === "-1") {
            console.log("course not found");
        }

        else{

            db.collection(`users/${uid}/${this.props.name}`).doc(courseId).set({
                "units": this.state.newUnits,
                "grade": this.state.newGrade,
                "reason": this.state.newReason,
                "id": courseId,
                "title": courseTitle
            }).then(() => {
                console.log("added course");
                this.setState({success: true});

                let course = new UserCourse(this.state.newCourse, this.state.newReason, this.state.newGrade, this.state.newUnits, this.props.name, courseTitle)
                let courses = this.state.courses;
                courses.push(course);
                this.setState({courses: courses})
            }).catch((error) => {
                console.log(error.code, error.message);
                this.setState({failure: true});
            });
        }



        this.handleClose();

   }




    render() {

        return (
            <Accordion>
                <AccordionSummary className="quarter-summary">
                    <div className="">
                        <h1 id="quarter-title"><strong>{this.props.name}</strong></h1>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Course</TableCell>
                                    <TableCell align="right">Units</TableCell>
                                    <TableCell align="right">Grade</TableCell>
                                    <TableCell align="right">Reason</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {this.state.courses.map((course, i) => (

                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">{course.code}
                                        </TableCell>
                                        <TableCell align="right">{course.units}</TableCell>
                                        <TableCell align="right">{course.grade}</TableCell>
                                        <TableCell align="right">{course.reason}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell align="right"> </TableCell>
                                <TableCell align="right">{this.state.totalUnits}</TableCell>
                                <TableCell align="right"> </TableCell>
                                <TableCell align="right"><Button onClick={this.handleOpen}><AddCircleIcon/></Button></TableCell>

                                <Dialog open={this.state.open}>
                                    <DialogTitle>Add a course</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="name"
                                            label="Course Code (e.g., CS 194W)"
                                            type="text"
                                            value={this.state.newCourse}
                                            onChange={(evt) => this.setState({newCourse: evt.target.value})}
                                            fullWidth
                                        />

                                        <TextField
                                            required
                                            autoFocus
                                            error={this.state.newUnits < 0 || this.state.newUnits > 10}
                                            margin="dense"
                                            id="units"
                                            label="Units"
                                            type="number"
                                            onChange={(evt) => this.setState({newUnits: parseInt(evt.target.value)})}
                                            fullWidth
                                        />

                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="grade"
                                            label="Grade"
                                            type="text"
                                            onChange={(evt) => this.setState({newGrade: evt.target.value})}
                                            fullWidth
                                        />


                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="reason"
                                            label="Reason"
                                            type="text"
                                            onChange={(evt) => this.setState({newReason: evt.target.value})}
                                            fullWidth
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.handleClose} color="primary" className="cancelButton">
                                            Cancel
                                        </Button>

                                        <Button onClick={this.addCourse} color="primary">
                                            Add
                                        </Button>
                                    </DialogActions>

                                </Dialog>

                            </TableRow>
                        </Table>

                    </TableContainer>
                </AccordionDetails>

                <div>
                    <Snackbar onClose={() => this.setState({success: false})} open={this.state.success} autoHideDuration={2000}>
                        <MuiAlert severity="success">
                            Class added! 😃
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar onClose={() => this.setState({failure: false})} open={this.state.failure} autoHideDuration={2000}>
                        <MuiAlert severity="warning">
                            Oops 🥴... something went wrong
                        </MuiAlert>
                    </Snackbar>
                </div>


            </Accordion>

        );
    }
}

export default Quarter

