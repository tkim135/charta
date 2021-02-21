import React, {Component} from 'react';
import Quarter from './quarter';
import Grid from '@material-ui/core/Grid';
import firebase from "firebase";
import 'firebase/firestore'
import '../firebase';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import TableRow from "@material-ui/core/TableRow";

interface PlannerState {
    loading: boolean;
    quarters: Array<string>;
    empty: boolean;
    open: boolean;
    add: boolean
}

interface PlannerProps {
}

class Planner extends Component<PlannerProps, PlannerState> {

    async componentDidMount() {
        const db = firebase.firestore();
        let user = firebase.auth().currentUser;
        const userRef = db.collection('users').doc(user?.uid);
        const doc = await userRef.get();


        if (!doc.exists) {
            console.log('No such document!');
            this.setState({empty: true})
        } else {
            console.log('Document data:', doc.data());
            let quarters = doc.data()?.quarters;
            this.setState({quarters: quarters});
        }

        this.setState({loading: false});

    }

    constructor(props: PlannerProps) {
        super(props);
        this.state = {loading: true, quarters: [], empty: false, open: false, add: false};

        this.addQuarter = this.addQuarter.bind(this);

    }

    addQuarter() {

    }

    render() {
        return(
            <Container>
                <Backdrop  open={this.state.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>


                <Grid container spacing={3}>
                    <Grid item>
                        <h1>Planned Schedule</h1>

                    </Grid>
                    <Grid item>
                        <Button onClick={() => this.setState({open: true})} >Add quarter<AddCircleIcon/></Button>
                        </Grid>
                </Grid>


                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        {this.state.quarters.length > 0 ? this.state.quarters.map((quarter: string, i: number) => {
                            if(i % 3 === 0){return <Quarter name={this.state.quarters[i]} key={i}/>}
                            else {return <span/>}
                        }) : ''}

                    </Grid>
                    <Grid item xs={4}>
                        {this.state.quarters.length > 0 ? this.state.quarters.map((quarter: string, i: number) => {
                            if(i % 3 === 1){return <Quarter name={this.state.quarters[i]} key={i}/>}
                            else {return <span/>}
                        }) : ''}
                    </Grid>
                    <Grid item xs={4}>
                        {this.state.quarters.length > 0 ? this.state.quarters.map((quarter: string, i: number) => {
                            if(i % 3 === 2){return <Quarter name={this.state.quarters[i]} key={i}/>}
                            else {return <span/>}
                        }) : ''}                    </Grid>

                </Grid>


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
                            // value={this.state.newCourse}
                            // onChange={(evt) => this.setState({newCourse: evt.target.value})}
                            fullWidth
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="title"
                            type="text"
                            // onChange={(evt) => this.setState({newTitle: evt.target.value})}
                            fullWidth
                        />


                    </DialogContent>
                    <DialogActions>
                        <Button  variant="outlined" color="primary"  onClick={() => this.setState({open: false, add: false})} className="cancelButton">
                            Cancel
                        </Button>

                        <Button onClick={() => this.setState({open: false, add: true})} color="primary">
                            Add
                        </Button>
                    </DialogActions>

                </Dialog>



            </Container>


        );
    }


}


export default Planner;