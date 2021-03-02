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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DeleteIcon from '@material-ui/icons/Delete';

interface QuarterState {
    addCourse: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    courses: Array<UserCourse>;
    newCode: string;
    newTitle: string;
    newUnits: number;
    newGrade: string;
    newReason: string;
    totalUnits: number;
    success: boolean;
    failure: boolean;
    shouldDeleteQuarter: boolean
}
interface QuarterProps {
    name: string,
    deleteQuarter: (quarter: string) => void;
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
               let course = new UserCourse(courseData?.code, courseData?.reason, courseData?.grade, courseData?.units, this.props.name, courseData?.title, doc.id)
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


    //TODO: case when multiple course ids
    async findCourse(courseCode: string) {
        const db = firebase.firestore();
        const coursesRef = await db.collection('classes');

        let courseId = "-1";
        let courseTitle = "";

        await coursesRef.where('Codes', 'array-contains', courseCode.toUpperCase()).get()
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


    constructor(props: QuarterProps) {
        super(props);

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addCourse = this.addCourse.bind(this);
        this.findCourse = this.findCourse.bind(this);
        this.handleDeleteQuarter = this.handleDeleteQuarter.bind(this);
        this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
        this.loadCourses = this.loadCourses.bind(this);

        this.state = {addCourse: false,
                   onClick: this.handleOpen,
                   courses: [],
                 newCode: '',
                  newTitle: '',
                  newGrade: '',
                  newUnits: 0,
                 newReason: '',
                totalUnits: 0,
                  success: false,
                 failure: false,
                 shouldDeleteQuarter: false
                    };

    }


    handleOpen() {
        this.setState({addCourse: true});
    }

    handleClose() {
        this.setState({addCourse: false});
    }



    // TODO: Check if course already in quarter
    // TODO: Check if units are valid (i.e., not possible to take CS 229 for 10 units, even though it should be)
    async addCourse() {

        const db = firebase.firestore();
        let uid = firebase.auth().currentUser?.uid;
        let [courseId, courseTitle] = await this.findCourse(this.state.newCode);

        if(courseId === "-1") {
            console.log("course not found");
            this.setState({failure: true});
        }

        else{

            db.collection(`users/${uid}/${this.props.name}`).doc(courseId).set({
                "units": this.state.newUnits,
                "grade": this.state.newGrade,
                "reason": this.state.newReason,
                "id": courseId,
                "title": courseTitle,
                "code": this.state.newCode
            }).then(() => {
                console.log("added course");
                this.setState({success: true});

                let course = new UserCourse(this.state.newCode, this.state.newReason, this.state.newGrade, this.state.newUnits, this.props.name, courseTitle, courseId)
                let courses = this.state.courses;
                courses.push(course);
                this.setState({courses: courses})
                let newTotalUnits = this.state.totalUnits + this.state.newUnits;
                this.setState({totalUnits: newTotalUnits});
            }).catch((error) => {
                console.log(error.code, error.message);
                this.setState({failure: true});
            });
        }



        this.handleClose();

   }

   async handleDeleteCourse(index: number) {
       const db = firebase.firestore();
       let courseId = this.state.courses[index].id;
       let uid = firebase.auth().currentUser?.uid;
       let success = false;

       db.collection(`users/${uid}/${this.props.name}`).doc(uid).delete().then(() => {
           console.log("Course successfully deleted!");
           success = true;
       }).catch((error) => {
           console.error("Error deleting course: ", error);
       });

       if(success) {
           let courses = this.state.courses;
           courses.slice(index, 1 );
           this.setState({courses: courses});
       }

   }


   handleDeleteQuarter() {
       this.setState({shouldDeleteQuarter: false});
       this.props.deleteQuarter(this.props.name);
   }




    render() {

        return (
            <Accordion>
                <AccordionSummary className="quarter-summary">
                    <div>
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
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {this.state.courses.map((course, i) => (

                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">{course.code}</TableCell>
                                        <TableCell align="right">{course.units}</TableCell>
                                        <TableCell align="right">{course.grade}</TableCell>
                                        <TableCell align="right">{course.reason}</TableCell>
                                        <TableCell align="right"> <Button onClick={() => this.handleDeleteCourse(i)}><DeleteIcon/></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell align="right">{this.state.totalUnits}</TableCell>
                                <TableCell align="right"> </TableCell>
                                <TableCell align="right"> </TableCell>
                                <TableCell align="right"> </TableCell>
                            </TableRow>

                        </Table>
                        <Button onClick={this.handleOpen}><AddCircleIcon/></Button>
                        <Button onClick={()=> this.setState({shouldDeleteQuarter: true})}><HighlightOffIcon/></Button>

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

                <div>
                    <Dialog open={this.state.shouldDeleteQuarter}>
                        <DialogTitle>Delete quarter?</DialogTitle>
                        <DialogContent>
                            This can't be undone. 🥶
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.setState({shouldDeleteQuarter: false})} color="primary" className="cancelButton">
                                Cancel
                            </Button>

                            <Button onClick={this.handleDeleteQuarter} color="primary">
                                Confirm
                            </Button>
                        </DialogActions>

                    </Dialog>

                </div>

                <Dialog open={this.state.addCourse}>
                    <DialogTitle>Add a course</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            label="Course Code (e.g., CS 194W)"
                            type="text"
                            value={this.state.newCode}
                            onChange={(evt) => this.setState({newCode: evt.target.value})}
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


            </Accordion>

        );
    }
}

export default Quarter

