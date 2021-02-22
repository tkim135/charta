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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


interface PlannerState {
    loading: boolean;
    quarters: Array<string>;
    empty: boolean;
    open: boolean;
    success: boolean;
    failure: boolean;
    term: string;
    year: number;
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
        this.state = {loading: true, quarters: [], empty: false, open: false, success: false, term: "", year: 2021, failure: false};
        this.addQuarter = this.addQuarter.bind(this);

    }

    async addQuarter() {
        this.setState({open: false});

        let uid = firebase.auth().currentUser?.uid;
        const db = firebase.firestore();

        let quarter = `${this.state.term + " " + this.state.year}`;


        const userRef = db.collection('users').doc(uid);


        let quarters = this.state.quarters;
        quarters.push(quarter);

        this.setState({quarters: quarters});

        await userRef.update({
            quarters: quarters
        });

        db.collection(`users/${uid}/${quarter}`).doc("test").set({
            ignore: "true"
        }).then((res) => {
            console.log(res);
            this.setState({success: true});
        }).catch((error) => {
            console.log(error.code, error.message);
            this.setState({failure: true});
        });



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
                    <DialogTitle>Add quarter</DialogTitle>
                    <DialogContent>

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Term</FormLabel>
                            <RadioGroup aria-label="term" name="term" value={this.state.term} onChange={(evt) => this.setState({term: evt.target.value})}
                            >
                                <FormControlLabel value="Fall" control={<Radio />} label="Fall" />
                                <FormControlLabel value="Winter" control={<Radio />} label="Winter" />
                                <FormControlLabel value="Spring" control={<Radio />} label="Spring" />
                                <FormControlLabel value="Summer" control={<Radio />} label="Summer" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="year"
                            type="number"
                            value={this.state.year}

                            onChange={(evt) => this.setState({year: parseInt(evt.target.value)})}
                            fullWidth
                        />


                    </DialogContent>
                    <DialogActions>
                        <Button  variant="outlined" color="primary"  onClick={() => this.setState({open: false})} className="cancelButton">
                            Cancel
                        </Button>

                        <Button onClick={this.addQuarter} color="primary">
                            Add
                        </Button>
                    </DialogActions>

                </Dialog>



                <div>
                    {/*<Button variant="outlined" onClick={() => this.setState({success: true})}>*/}
                    {/*    Open success snackbar*/}
                    {/*</Button>*/}

                    {/*<Button variant="outlined" onClick={() => this.setState({failure: true})}>*/}
                    {/*    Open error snackbar*/}
                    {/*</Button>*/}

                    <Snackbar onClose={() => this.setState({success: false})} open={this.state.success} autoHideDuration={2000}>
                        <MuiAlert severity="success">
                            Quarter added! 😃
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar onClose={() => this.setState({failure: false})} open={this.state.failure} autoHideDuration={2000}>
                        <MuiAlert severity="warning">
                            Oops 🥴... something went wrong
                        </MuiAlert>
                    </Snackbar>
                </div>

            </Container>
        );
    }


}


export default Planner;