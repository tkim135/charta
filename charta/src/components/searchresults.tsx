import { RouteComponentProps } from 'react-router';
import React, {Component} from 'react';
import firebase from "firebase";
import 'firebase/firestore';
import '../firebase';
import Course from "../data/course";

interface SearchResultState {
    courses: Array<Course>
}

interface SearchResultProps {
}

class SearchResults extends Component<SearchResultProps & RouteComponentProps, SearchResultState> {

    constructor(props: any) {
        super(props);

        this.state = { courses : [] };
    }

    componentDidMount() {
        const courseId = (this.props.match.params as any).courseId;

        const db = firebase.firestore();

        const docRef = db.collection('classes').doc(courseId);

        var query = docRef.get()
            .then(querySnapshot => {

                var courseArray : Course[] = []

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
                courseArray.push(course);
                this.setState({ courses : courseArray });
                console.log("State printing:", this.state);
            })
            .catch(err => {
                console.log('Error getting document', err);
            });;

    }

    render() {
        return (<div>
            {this.state}
        </div>);
    }
}

export default SearchResults;