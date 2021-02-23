import { RouteComponentProps } from 'react-router';
import React, {Component} from 'react';
import firebase from "firebase";
import 'firebase/firestore';
import '../firebase';
import Course from "../data/course";
import Header from "./header";
import Footer from "./footer";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Chip from '@material-ui/core/Chip';

interface SearchResultState {
    course: Course,
    loading: boolean
}

interface SearchResultProps {
}

class SearchResults extends Component<SearchResultProps & RouteComponentProps, SearchResultState> {

    constructor(props: any) {
        super(props);
        let course =  new Course("", [], "", [], "", 0, 0, [], "");
        this.state = {course: course, loading: true}

    }

    componentDidMount() {
        const courseId = (this.props.match.params as any).courseId;
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
                    courseElements["Terms"],
                    courseElements["Title"]
                );

                this.setState({ course : course });

            })
            .catch((err) => {
                console.log('Error getting document', err.code, err.message);
            });

        this.setState({ loading : false });

    }

    render() {
        return (
            <div className="flex flex-col h-screen justify-between">
                <Backdrop  open={this.state.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Header/>

                <Container>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Card>
                                <CardContent>
                                    <h1>{this.state.course.title} ({this.state.course.codes})</h1>

                                    <p>{this.state.course.description}</p>


                                  Units: {this.state.course.minUnits === this.state.course.maxUnits ? <p>{this.state.course.maxUnits}</p> : <p>{this.state.course.minUnits}-{this.state.course.maxUnits}</p>}


                                    <Chip
                                        color="primary"
                                        label={this.state.course.GER}
                                    />
                                </CardContent>

                                <CardActions>
                                    <Button size="small">Find study groups</Button>
                                    <Button size="small">Add to academic plan <AddCircleIcon/></Button>
                                </CardActions>
                            </Card>


                        </Grid>
                        <Grid item>

                        </Grid>
                    </Grid>
                </Container>





                <Footer/>
            </div>
        );
    }
}

export default SearchResults;