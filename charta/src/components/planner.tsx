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
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

interface PlannerState {
    loading: boolean;
    quarters: Array<string>;
    empty: boolean;
    open: boolean;
    addQuarterSuccess: boolean;
    addQuarterFailure: boolean;
    deleteQuarterSuccess: boolean;
    deleteQuarterFailure: boolean
    term: string;
    year: number;
    welcome: boolean;
    firstName: string;

}

interface PlannerProps {

}

class Planner extends Component<PlannerProps, PlannerState> {



    // TODO: fix duplicated code
    // this was copied from course.tsx, I did not want to change that code and risk breaking before demo
    sortTerms(terms: Array<string>) {
        let sortedArray: string[] = terms.sort((n1,n2) => {
            if (n1.substring(0,9) > n2.substring(0,9)) {
                return 1;
            }

            if (n1.substring(0,9) < n2.substring(0,9)) {
                return -1;
            }
            // if years are equal, compare "Autumn", "Winter", or "Spring"
            // winter and spring are exceptions to alphabetical rule
            // otherwise, alphabetical comparisons work
            if (n1.substring(10) === "Winter" && n2.substring(10) === "Spring") {
                return -1;
            }
            if (n2.substring(10) === "Winter" && n1.substring(10) === "Spring") {
                return 1;
            }

            // actually, so are winter and summer
            if (n1.substring(10) === "Winter" && n2.substring(10) === "Summer") {
                return -1;
            }
            if (n2.substring(10) === "Winter" && n1.substring(10) === "Summer") {
                return 1;
            }

            // alphabetical
            if (n1.substring(10) < n2.substring(10)) {
                return -1;
            }

            if (n1.substring(10) > n2.substring(10)) {
                return 1;
            }

            return 0;
        });
        return sortedArray;
    }


    async componentDidMount() {
        const db = firebase.firestore();
        let user = firebase.auth().currentUser;
        const userRef = db.collection('users').doc(user?.uid);
        const doc = await userRef.get();


        if (!doc.exists) {
            console.log('No such user!');

        } else {
            console.log('Document data:', doc.data());
            let quarters = doc.data()?.quarters;

            this.setState({firstName: doc.data()?.firstName});

            if(quarters) {
                quarters = this.sortTerms(quarters);

                this.setState({quarters: quarters});
            }

            else {
                this.setState({quarters: []});
            }

            if(this.state.quarters.length == 0){
                this.setState({welcome: true});
            }

        }

        this.setState({loading: false});

    }

    constructor(props: PlannerProps) {
        super(props);
        this.state = {loading: true,
                    quarters: [],
                       empty: false,
                        open: false,
            addQuarterSuccess: false,
            addQuarterFailure: false,
            deleteQuarterFailure: false,
            deleteQuarterSuccess: false,
                        term: "",
                        year: 2021,
                        welcome: false,
                        firstName: ""};

        this.addQuarter = this.addQuarter.bind(this);
        this.sortTerms = this.sortTerms.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.deleteQuarter = this.deleteQuarter.bind(this);

    }


    removeItem(arr: Array<any>, el: any) {
        let index = arr.indexOf(el);
        if (index !== -1) {
            arr.splice(index, 1);
        }
        return arr
    }

    //TODO: delete quarter collection (each user has field which is an array of quarter strings, but also a collection for each quarter)
    async deleteQuarter(quarter: string) {
        const db = firebase.firestore();
        let uid = firebase.auth().currentUser?.uid;
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('No such user!');
            return;
        }

        try {
            console.log('Document data:', doc.data());
            let quarters = doc.data()?.quarters;
            let index = quarters.indexOf(quarter);
            if (index !== -1) quarters.splice(index, 1);
            await db.collection("users").doc(uid).update({quarters: quarters});
            this.setState({quarters: quarters})
            this.setState({deleteQuarterSuccess: true})
        }
        catch (e) {
            console.log(e);
            this.setState({deleteQuarterFailure: true})
        }

    }

    async addQuarter() {

        if(!this.state.term) return;


        this.setState({open: false});

        let uid = firebase.auth().currentUser?.uid;
        const db = firebase.firestore();

        let quarter = `${this.state.term + " " + this.state.year}`;

        const userRef = db.collection('users').doc(uid);

        let quarters = this.state.quarters;
        quarters.push(quarter);

        quarters = this.sortTerms(quarters);


        this.setState({quarters: quarters});

        await userRef.update({
            quarters: quarters
        });

        db.collection(`users/${uid}/${quarter}`).doc("ignore").set({
            ignore: "true"
        }).then((res) => {
            console.log(res);
            this.setState({addQuarterSuccess: true});
        }).catch((error) => {
            console.log(error.code, error.message);
            this.setState({addQuarterFailure: true});
        });

    }

    render() {
        const theme = createMuiTheme({
            palette: {
                primary: { main: "#6FCF97" },
                secondary: { main: '#6FCF97' },
            },
        });

        return(
            <MuiThemeProvider theme={theme}>

            <Container maxWidth="xl" >
                <Backdrop  open={this.state.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                {/*Align "Planned Schedule" and "Add Quarter" vertically */}
                <Grid container spacing={3} alignItems='center'>
                    <Grid item>
                        <Typography component="h1" variant="h5" align="center">Planned Schedule</Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => this.setState({open: true})} >Add quarter<AddCircleIcon/></Button>
                        </Grid>
                </Grid>


                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        {this.state.quarters.length > 0 ? this.state.quarters.map((quarter: string, i: number) => {
                            if(i % 3 === 0){return <Quarter deleteQuarter={this.deleteQuarter} name={this.state.quarters[i]} key={i}/>}
                            else {return <span/>}
                        }) : ''}

                    </Grid>
                    <Grid item xs={4}>
                        {this.state.quarters.length > 0 ? this.state.quarters.map((quarter: string, i: number) => {
                            if(i % 3 === 1){return <Quarter deleteQuarter={this.deleteQuarter} name={this.state.quarters[i]} key={i}/>}
                            else {return <span/>}
                        }) : ''}
                    </Grid>
                    <Grid item xs={4}>
                        {this.state.quarters.length > 0 ? this.state.quarters.map((quarter: string, i: number) => {
                            if(i % 3 === 2){return <Quarter deleteQuarter={this.deleteQuarter} name={this.state.quarters[i]} key={i}/>}
                            else {return <span/>}
                        }) : ''}
                    </Grid>

                </Grid>


                <Dialog open={this.state.open}>
                    <DialogTitle><h1 className="text-center">Add quarter</h1></DialogTitle>
                    <DialogContent>

                        <FormControl component="fieldset" required={true}>
                            <FormLabel component="legend">Term</FormLabel>
                            <RadioGroup aria-label="term"  name="term" value={this.state.term} onChange={(evt) => this.setState({term: evt.target.value})}
                            >
                                <FormControlLabel value="Fall" control={<Radio/>} label="Fall" />
                                <FormControlLabel value="Winter" control={<Radio />} label="Winter" />
                                <FormControlLabel value="Spring" control={<Radio/>} label="Spring" />
                                <FormControlLabel value="Summer" control={<Radio/>} label="Summer" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="year"
                            type="number"
                            value={this.state.year}
                            required
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


                <Dialog open={this.state.welcome && !this.state.loading}>
                    <DialogTitle><h1 className="text-center">Welcome, {this.state.firstName} 👋 </h1></DialogTitle>
                    <DialogContent>
                        <Container maxWidth="sm">
                            <p>We're glad that you're here. Feel free to look up courses, plan your quarters, or find study groups.</p>
                        </Container>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=> this.setState({welcome: false})} color="primary">
                            Let's get started
                        </Button>
                    </DialogActions>
                </Dialog>

                <div>
                    <Snackbar onClose={() => this.setState({addQuarterSuccess: false})} open={this.state.addQuarterSuccess} autoHideDuration={2000}>
                        <MuiAlert severity="success">
                            Quarter added! 😃
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar onClose={() => this.setState({addQuarterFailure: false})} open={this.state.addQuarterFailure} autoHideDuration={2000}>
                        <MuiAlert severity="warning">
                            Oops 🥴... something went wrong
                        </MuiAlert>
                    </Snackbar>


                    <Snackbar onClose={() => this.setState({deleteQuarterSuccess: false})} open={this.state.deleteQuarterSuccess} autoHideDuration={2000}>
                        <MuiAlert severity="success">
                            Quarter deleted! 😃
                        </MuiAlert>
                    </Snackbar>


                    <Snackbar onClose={() => this.setState({deleteQuarterFailure: false})} open={this.state.addQuarterFailure} autoHideDuration={2000}>
                        <MuiAlert severity="warning">
                            Oops 🥴... something went wrong
                        </MuiAlert>
                    </Snackbar>
                </div>



                {/*<div>*/}
                {/*    <Snackbar onClose={() => this.setState({success: false})} open={this.state.success} autoHideDuration={2000}>*/}
                {/*        <MuiAlert severity="success">*/}
                {/*            Quarter added! 😃*/}
                {/*        </MuiAlert>*/}
                {/*    </Snackbar>*/}

                {/*    <Snackbar onClose={() => this.setState({failure: false})} open={this.state.failure} autoHideDuration={2000}>*/}
                {/*        <MuiAlert severity="warning">*/}
                {/*            Oops 🥴... something went wrong*/}
                {/*        </MuiAlert>*/}
                {/*    </Snackbar>*/}
                {/*</div>*/}

            </Container>
            </MuiThemeProvider>
        );
    }


}


export default Planner;