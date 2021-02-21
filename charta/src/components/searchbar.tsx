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
        this.state = {loading: false, open: false, suggestions: [], query: ''};

        this.setOpen = this.setOpen.bind(this);
        this.onInputChange = this.onInputChange.bind(this);

        this.onChange = this.onChange.bind(this);
    }

    setOpen(open: boolean) {

    }

    async onInputChange(event: object, value: string) {

        const db = firebase.firestore();
        // const ref = db.collection("courses");
        // const query  = ref.where("title", "array-contains", "value");

        const coursesRef = await db.collection('classes');

        var query = coursesRef.where('title', 'array-contains', value).get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log("nothing found");

                } else {
                    // for(Document doc in querySnapshot.docs) {
                    //     // var doc = querySnapshot.docs[0];
                    //     console.log('Document data:', doc.data());
                    //
                    // }
                    querySnapshot.docs.forEach(doc => console.log(doc.data()));

                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });


    }

    onChange() {

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
                    getOptionLabel={(course) => course.title}
                    loading={this.state.loading}
                    onInputChange={this.onInputChange}
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