import React, {Component} from 'react';
import Quarter from './quarter';
import Grid from '@material-ui/core/Grid';
import firebase from "firebase";
import 'firebase/firestore'
import '../firebase';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';

interface PlannerState {
    loading: boolean;
    quarters: Array<string>;
    empty: boolean;
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
        this.state = {loading: true, quarters: [], empty: false};

    }


    render() {
        return(
            <Container>
                <Backdrop  open={this.state.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <h1>Courses</h1>


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

            </Container>


        );
    }


}


export default Planner;