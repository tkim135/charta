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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionActions from '@material-ui/core/AccordionActions';

interface QuarterState {
    addCourse: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    courses: Array<UserCourse>;
    newCode: string;
    newTitle: string;
    newUnits: number;
    newGrade: string;
    newReason: string;
    newWays: string;
    totalUnits: number;
    addCourseSuccess: boolean;
    addCourseFailure: boolean;
    deleteCourseSuccess: boolean;
    deleteCourseFailure: boolean;
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
               let course = new UserCourse(courseData?.code, courseData?.reason, courseData?.grade, courseData?.units, courseData?.ways, this.props.name, courseData?.title, doc.id)
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

        let scope = this;

        firebase.auth().onAuthStateChanged(async function(user)  {
            if (user) {
                await scope.loadCourses(`users/${user?.uid}/${scope.props.name}`);

            }
        });

    }


    //TODO: case when multiple course ids
    async findCourse(courseCode: string) {
        const db = firebase.firestore();
        const coursesRef = db.collection('classes');

        // initialize variables
        let courseId = "-1";
        let courseTitle = "";
        let courseMinUnits = 0;
        let courseMaxUnits = 10;
        let courseWays: Array<string> = [];

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
                        courseMinUnits = doc.data()["Min Units"];
                        courseMaxUnits = doc.data()["Max Units"];
                        courseWays = doc.data()["GER"];
                    });

                    if(courseIds.length != 0) {
                        courseId = courseIds[0];

                    }
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });

        let resultsArray : any = [courseId, courseTitle, courseMinUnits, courseMaxUnits, courseWays];
        return resultsArray;
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
        this.deleteButtonPressed = this.deleteButtonPressed.bind(this);

        this.state = {addCourse: false,
                   onClick: this.handleOpen,
                   courses: [],
                 newCode: '',
                  newTitle: '',
                  newGrade: '',
                  newUnits: 0,
                 newReason: '',
                 newWays: '',
                totalUnits: 0,
                addCourseSuccess: false,
                 addCourseFailure: false,
                 shouldDeleteQuarter: false,
                 deleteCourseFailure: false,
                 deleteCourseSuccess: false
                    };

    }


    handleOpen() {
        this.setState({addCourse: true});
    }

    handleClose() {
        this.setState({addCourse: false});
    }



    /* Function to add courses to a particular quarter. In cases where we fail to find the
    course in our database, we immediately return without closing the menu, keeping the user's
    previous input and allowing them to fix it. In a successful case, the this.handleClose() is
    called at the end to close the menu. */
    async addCourse() {

        const db = firebase.firestore();
        let uid = firebase.auth().currentUser?.uid;
        let [courseId, courseTitle, courseMinUnits, courseMaxUnits, courseWays] =
                await this.findCourse(this.state.newCode);

        if(courseId === "-1") {
            console.log("course not found");
            this.setState({addCourseFailure: true});
            return;
        }

        let courses = this.state.courses;
        // check for if course is already in quarter
        let currentCourseIds = courses.map(course => course.id);
        if (currentCourseIds.includes(courseId)) {
            this.setState({addCourseFailure: true});
            return;
        }

        // check if number of units is appropriate
        if (Number.isNaN(this.state.newUnits)
            || this.state.newUnits < courseMinUnits
            || this.state.newUnits > courseMaxUnits) {
                console.log("Wrong number of units!")
                this.setState({addCourseFailure: true});
                return;
        }

        if ((this.state.newWays) !== "" && !(courseWays.indexOf(this.state.newWays) > -1)) {
            console.log("Class can't fulfill inputted WAYS!");
            this.setState({addCourseFailure: true});
            return;
        }

        db.collection(`users/${uid}/${this.props.name}`).doc(courseId).set({
            "units": this.state.newUnits,
            "ways": this.state.newWays,
            "grade": this.state.newGrade,
            "reason": this.state.newReason,
            "id": courseId,
            "title": courseTitle,
            "code": this.state.newCode
        }).then(() => {
            console.log("added course");
            this.setState({addCourseSuccess: true});

            let course = new UserCourse(this.state.newCode, this.state.newReason, this.state.newGrade, this.state.newUnits, this.state.newWays, this.props.name, courseTitle, courseId)
            let courses = this.state.courses;
            courses.push(course);
            this.setState({courses: courses})
            let newTotalUnits = this.state.totalUnits + this.state.newUnits;
            this.setState({totalUnits: newTotalUnits});
        }).catch((error) => {
            console.log(error.code, error.message);
            this.setState({addCourseFailure: true});
            return;
        });

        this.handleClose();

   }

   async handleDeleteCourse(index: number) {
       const db = firebase.firestore();
       let courseId = this.state.courses[index].id;
       let uid = firebase.auth().currentUser?.uid;


       db.collection(`users/${uid}/${this.props.name}`).doc(courseId).delete().then(() => {
           console.log("Course successfully deleted!");

           let courses = this.state.courses;
           // update total unit count after deletion
           let newTotalUnits = this.state.totalUnits - courses[index].units;
           courses.splice(index, 1 );
           this.setState({courses: courses, deleteCourseSuccess: true,
                        totalUnits: newTotalUnits});

        
       }).catch((error) => {
           console.error("Error deleting course: ", error);
           this.setState({deleteCourseFailure: true});

       });



   }


   handleDeleteQuarter() {
       this.setState({shouldDeleteQuarter: false});
       this.props.deleteQuarter(this.props.name);
   }


   deleteButtonPressed(event: any) {
     event.stopPropagation();
     this.setState({shouldDeleteQuarter: true});
   }





    render() {

        return (
            <Accordion>
                <AccordionSummary className="quarter-summary" 
                    expandIcon={<ExpandMoreIcon/>}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"                
                   >
                        <Button onClick={this.deleteButtonPressed} onFocus={(event: any) => event.stopPropagation()}>
                             <HighlightOffIcon/>
                        </Button>

                        <h1 id="quarter-title" style={{display: "inline"}}><strong>{this.props.name}</strong></h1>
                                                   


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
                                    <TableCell align="right">Ways</TableCell>
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
                                        <TableCell
                                        align="right">{course.ways}</TableCell>
                                        <TableCell align="right"> <Button className="delete-button" onClick={() => this.handleDeleteCourse(i)}><DeleteIcon/></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell align="right">{this.state.totalUnits}</TableCell>
                                <TableCell align="right"> </TableCell>
                                <TableCell align="right"> </TableCell>
                                <TableCell align="right"> </TableCell>
                                <TableCell align="right"> </TableCell>
                            </TableRow>

                        </Table>

                        <div className="grid grid-cols-3" style={{padding: "20px 0 0 20px"}}>
                            <div className="col-start-3">
                            <Button onClick={this.handleOpen}>Add class <AddCircleIcon/></Button>

                            </div>
                        </div>
                    
                    </TableContainer>



                </AccordionDetails>
            
                
          

                <div>
                    <Snackbar onClose={() => this.setState({addCourseSuccess: false})} open={this.state.addCourseSuccess} autoHideDuration={2000}>
                        <MuiAlert severity="success">
                            Class added! 😃
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar onClose={() => this.setState({addCourseFailure: false})} open={this.state.addCourseFailure} autoHideDuration={2000}>
                        <MuiAlert severity="warning">
                            Sorry... we're not able to add that class with that specified information 🥴
                        </MuiAlert>
                    </Snackbar>
                </div>

                <div>
                    <Snackbar onClose={() => this.setState({deleteCourseSuccess: false})} open={this.state.deleteCourseSuccess} autoHideDuration={2000}>
                        <MuiAlert severity="success">
                            Class deleted! 😃
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar onClose={() => this.setState({deleteCourseFailure: false})} open={this.state.deleteCourseFailure} autoHideDuration={2000}>
                        <MuiAlert severity="warning">
                            Sorry... something went wrong
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
                            value={this.state.newCode} // give current value as default value
                            onChange={(evt) => this.setState({newCode: evt.target.value})}
                            fullWidth
                        />

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
                            id="grade"
                            label="Grade"
                            type="text"
                            value={this.state.newGrade} // give current value as default value
                            onChange={(evt) => this.setState({newGrade: evt.target.value})}
                            fullWidth
                        />


                        <TextField
                            autoFocus
                            margin="dense"
                            id="reason"
                            label="Reason"
                            type="text"
                            value={this.state.newReason} // give current value as default value
                            onChange={(evt) => this.setState({newReason: evt.target.value})}
                            fullWidth
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="ways"
                            label="Ways Fulfilling (e.g., WAY-SI)"
                            type="text"
                            // give current value as default value
                            value={this.state.newWays}
                            onChange={(evt) => this.setState({newWays: evt.target.value})}
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

