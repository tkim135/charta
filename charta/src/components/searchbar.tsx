import fetch from 'cross-fetch';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, {Component} from 'react';
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import firebase from "firebase/app";
import "firebase/auth";
import Course from "../data/course";
import { Link } from 'react-router-dom';


interface SearchBarState {
    loading: boolean,
    open: boolean,
    suggestions: Array<Course>,
    query: string
}

interface SearchBarProps {

}



class SearchBar extends Component<SearchBarProps, SearchBarState>{


    constructor(props: SearchBarProps) {
        super(props);
        // set open to false so that "No options" dropdown doesn't appear when user
        // isn't inputting
        this.state = {loading: false, open: false, suggestions: [], query: ''};
    }

    setOpen(open: boolean) {
        this.setState({open: open})
    }

    private convertCourseCodeFormat(value: string) {
        // converting to "{Subject} {Number}" format
        if (value.indexOf(' ') === -1) {
            // if user does not enter space between subject and number
            let numIndex = value.search(/\d/);
            value = value.substr(0, numIndex) + ' ' + value.substr(numIndex);
        }
        return value;
    }

    async onInputChange(event: object, value: string) {

        const db = firebase.firestore();

        const coursesRef = await db.collection('classes');

        let courseCode = this.convertCourseCodeFormat(value);

        coursesRef.where('Codes', 'array-contains', courseCode.toUpperCase()).get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log("nothing found");

                } else {
                    // clear suggestions array every time new query is entered
                    let suggestions : Course[] = [];

                    querySnapshot.docs.forEach(doc => {
                        console.log(doc.data());

                        suggestions.push(new Course(
                            doc.id,
                            doc.data()["Codes"],
                            doc.data()["Description"],
                            doc.data()["GER"],
                            doc.data()["Grading Basis"],
                            doc.data()["Min Units"],
                            doc.data()["Max Units"],
                            doc.data()["StudyPartners"],
                            doc.data()["Terms"],
                            doc.data()["Title"]
                        ));

                    });

                    this.setState({suggestions: suggestions, query: value})
                    console.log(this.state);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });


    }



    render() {
        return (
            <div>
                <Autocomplete
                    id="search"
                    style={{ width: 600 }}
                    open={this.state.open}

                    onOpen={() => {
                        this.setOpen(true);
                    }}
                    onClose={() => {
                        this.setOpen(false);
                    }}
                    options={this.state.suggestions}
                    getOptionSelected={(course, value) => course.title === value.title}
                    getOptionLabel={(course) => this.state.query}
                    renderOption={(course) => (
                        <React.Fragment>
                            <Link to={'/search/'+course.id}>
                                <div>
                                    <b>{course.codes.join(', ')}: <i>{course.title}</i></b><br />
                                    {course.description}
                                </div>
                            </Link>
                        </React.Fragment>
                    )}
                    loading={this.state.loading}
                    onInputChange={(event, value) => this.onInputChange(event, value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Search for classes"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),

                                endAdornment: (
                                    <React.Fragment>
                                        {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />
            </div>
        )
    }

}

export default (SearchBar);