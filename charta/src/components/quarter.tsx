import {Component} from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
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
import Course from '../data/course';
import UserCourse from '../data/usercourse';
// import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

interface QuarterState {
    open: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    courses: Array<any>;
    newCourse: string;
    newTitle: string;
    newUnits: number;
    newGrade: string;
    newReason: string;
}
interface QuarterProps {
    name: string
}
class Quarter extends Component<QuarterProps, QuarterState> {

    async loadCourse() {
        const db = firebase.firestore();

        // const courseRef = db.collection('courses').doc(id);
        // const course = await courseRef.get();
        //
        // let course = new UserCourse();


        // return course;

    }


    // load the courses for this quarter
   async loadCourses(path: string) {
       const db = firebase.firestore();

       // doc.data()?.["quarters"];

       let courses: Array<UserCourse>;

       // iterate over courses in this quarter
       // db.collection(path).get().then((querySnapshot) => {
       //
       //      // get the course
       //     querySnapshot.forEach((doc) =>  {
       //         let course = await this.loadCourse(doc);
       //         courses.push(course);
       //     })
       //
       //
       // });
       //
       // this.setState({courses: courses})

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

        this.state = {open: false, onClick: this.handleOpen, courses: [], newCourse: '', newTitle: '', newGrade: '', newUnits: 0, newReason: ''};


    }


    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    async addCourse() {
        this.state.courses.push(this.createData(this.state.newCourse, this.state.newTitle, this.state.newUnits, this.state.newGrade, this.state.newReason));

        const db = firebase.firestore();
        let user = firebase.auth().currentUser;
        const userRef = db.collection('users').doc(user?.uid);
        const doc = await userRef.get();

        // const userRef = db.collection('users').doc('ruben1');
        // const doc = await userRef.get();
        //
        //  .doc('LA').set({
        //     name: 'Los Angeles', state: 'CA', country: 'USA',
        //     capital: false, population: 3900000
        // });

        this.handleClose();
    }

    createData(number: string, title: string, units: number, grade: string, reason: string) {
        return {number, title, units, grade, reason };
    }

    render() {

        return (
            <Accordion>
                <AccordionSummary>{this.props.name}</AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Course Number</TableCell>
                                    <TableCell align="right">Title</TableCell>
                                    <TableCell align="right">Units</TableCell>
                                    <TableCell align="right">Grade</TableCell>
                                    <TableCell align="right">Reason</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.courses.map((course) => (
                                    <TableRow key={course.number}>
                                        <TableCell component="th" scope="row">
                                            {course.code}
                                        </TableCell>
                                        <TableCell align="right">{course.title}</TableCell>
                                        <TableCell align="right">{course.units}</TableCell>
                                        {/*<TableCell align="right">{course.grade}</TableCell>*/}
                                        {/*<TableCell align="right">{course.reason}</TableCell>*/}
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell align="right"> </TableCell>
                                <TableCell align="right">18</TableCell>
                                <TableCell align="right">4.0</TableCell>
                                <TableCell align="right"><Button onClick={this.handleOpen}><AddCircleIcon/></Button></TableCell>

                                <Dialog open={this.state.open}>
                                    <DialogTitle>Add a course</DialogTitle>
                                    <DialogContent>
                                        {/*<DialogContentText>*/}
                                        {/*    To subscribe to this website, please enter your email address here. We will send updates*/}
                                        {/*    occasionally.*/}
                                        {/*</DialogContentText>*/}
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="name"
                                            label="course"
                                            type="text"
                                            value={this.state.newCourse}
                                            onChange={(evt) => this.setState({newCourse: evt.target.value})}
                                            fullWidth
                                        />

                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="title"
                                            label="title"
                                            type="text"
                                            onChange={(evt) => this.setState({newTitle: evt.target.value})}
                                            fullWidth
                                        />

                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="units"
                                            label="units"
                                            type="number"
                                            onChange={(evt) => this.setState({newUnits: parseInt(evt.target.value)})}
                                            fullWidth
                                        />

                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="grade"
                                            label="grade"
                                            type="text"
                                            onChange={(evt) => this.setState({newGrade: evt.target.value})}
                                            fullWidth
                                        />


                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="reason"
                                            label="reason"
                                            type="text"
                                            onChange={(evt) => this.setState({newReason: evt.target.value})}
                                            fullWidth
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.handleClose} color="primary">
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

            </Accordion>

        );
    }
}

export default Quarter

