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

interface SearchResultState {
    course: Course,
    loading: boolean
}

interface SearchResultProps {
}

interface CourseCardProps {
    course: Course
}


class CourseCard extends Component<CourseCardProps>{


    render() {
        let course = this.props.course;

        return (
            <Card>
            <CardContent>
                <h1>{course.title} ({course.codes})</h1>

                <p>{course.description}</p>

                Units: {course.minUnits === course.maxUnits ? <p>{course.maxUnits}</p> : <p>{course.minUnits}-{course.maxUnits}</p>}

                GER: {course.GER.length === 0 ? <span/> : <Chip
                color="primary"
                label={course.GER}
                />}



                <br/>

                {course.terms.map((term: string, i: number) => {
                    return <Chip color="secondary" label={term} key={i}/>
                }) }

                <Chip label={course.gradingBasis}/>


            </CardContent>

            <CardActions>
                <Button size="small">Find study groups</Button>
                <Button size="small">Add to academic plan <AddCircleIcon/></Button>
            </CardActions>
        </Card>
        );
    }
}

class SearchResults extends Component<SearchResultProps & RouteComponentProps, SearchResultState> {

    constructor(props: any) {
        super(props);
        let course =  new Course("", [], "", [], "", 0, 0, [], "");
        this.state = {course: course, loading: true}

        this.loadCourseData = this.loadCourseData.bind(this);
    }

    async componentWillReceiveProps(nextProps: any) {
        await this.loadCourseData();
        console.log('url changes');
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
                courseElements["Terms"],
                courseElements["Title"]
            );

            this.setState({ course : course });

        })
            .catch((err) => {
                console.log('Error getting course', err);
            });

        this.setState({ loading : false });
    }

    async componentDidMount() {
        await this.loadCourseData();
    }

    render() {

        let course = this.state.course
        return (
            <div className="flex flex-col h-screen justify-between">

                <Header/>

                <Container>
                    <Grid container spacing={3}>
                        <Grid item>
                            {this.state.loading ? <CircularProgress/> : <CourseCard course={course}/>}

                        </Grid>

                    </Grid>
                </Container>





                <Footer/>
            </div>
        );
    }
}

export default withRouter(SearchResults);