import { RouteComponentProps, withRouter } from 'react-router';
import React, {Component} from 'react';
import firebase from "firebase";
import 'firebase/firestore';
import '../firebase';
import Course from "../data/course";
import Header2 from "./header2";
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
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';


import './rec.css'


interface CourseCardProps {
    course: Course
}

// how to call firebase function 
// todo: recheck that change to oncall hasn't broken things
// https://firebase.google.com/docs/functions/callable#web_2
class CourseCard extends Component<CourseCardProps>{
    render() {
        let course = this.props.course;
        return (
            <Card>
            <CardContent>
                <h1>{course.title} ({course.codes.join(', ')})</h1>

                <p>{course.description}</p>
                Units: {course.minUnits === course.maxUnits ? <span>{course.maxUnits}</span> : <span>{course.minUnits}-{course.maxUnits}</span>}
                <br/>

                GER: {course.GER[0] ? course.GER.map((GER: string, i: number) => {
                    return <Chip color="primary" label={GER} key={i}/>
                }) : <span>None</span> }
                
                <br/>

                {course.terms.map((term: string, i: number) => {
                    return <Chip color="secondary" label={term} key={i}/>
                }) }

                <Chip label={course.gradingBasis}/>
            </CardContent>

            <CardActions>
                    <Button size="small">Find study groups</Button>
                    <Button size="small">Add to academic plan <AddCircleIcon/></Button>
                    <Button size="small">Find similar classes</Button>
            </CardActions>
        </Card>
        );
    }
}

interface RecommenderPageProps {
}

interface RecommenderPageState {
    keywords: string,
    gers: Array<string>,
    terms: Array<string>,
    units: Array<number>,
    recommendations: Array<Course>,

    showGER: boolean,
    showTerms: boolean, 
    showUnits: boolean
}

class RecommenderPage extends Component<RecommenderPageProps, RecommenderPageState>{
    constructor (props: RecommenderPageProps) {
        super(props); 
        this.state = {
            keywords: '', 
            gers: [], 
            terms: [], 
            units: [],
            recommendations: [], 
            showGER: false, 
            showTerms: false,
            showUnits: false
        }; 
    }
    handleGERCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked && !this.state.gers.includes(event.target.value)) {
            this.setState({gers: [...this.state.gers, event.target.value]}); 
        } else {
            if (this.state.gers.includes(event.target.value)) {
                var gersCopy = [...this.state.gers]
                var index = gersCopy.indexOf(event.target.value);
                if (index != -1) {
                    gersCopy.splice(index, 1)
                    this.setState({gers: gersCopy})   
                }
            }
        }
    }

    handleTermsCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked && !this.state.terms.includes(event.target.value)) {
            this.setState({terms: [...this.state.terms, event.target.value]}); 
        } else {
            if (this.state.terms.includes(event.target.value)) {
                var termsCopy = [...this.state.terms]
                var index = termsCopy.indexOf(event.target.value);
                if (index != -1) {
                    termsCopy.splice(index, 1)
                    this.setState({terms: termsCopy})   
                }
            }
        }
    }

    handleUnitsCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
        let unit = parseInt(event.target.value); 
        console.log(unit)

        if (event.target.checked && !this.state.units.includes(unit)) {
            this.setState({units: [...this.state.units, unit]}); 
        } else {
            if (this.state.units.includes(unit)) {
                var unitsCopy = [...this.state.units]
                var index = unitsCopy.indexOf(unit);
                if (index != -1) {
                    unitsCopy.splice(index, 1)
                    this.setState({units: unitsCopy})   
                }
            }
        }
        console.log(this.state.units)
    }

    handleGERButton() {
        this.setState({showGER: !this.state.showGER, showTerms: false, showUnits: false})
    }


    handleTermsButton() {
        this.setState({showGER: false, showTerms: !this.state.showTerms, showUnits: false})
    }

    handleUnitsButton() {
        this.setState({showGER: false, showTerms: false, showUnits: !this.state.showUnits})
    }
    render() {
        return (
            <div className="flex flex-col h-screen justify-between mainContent">
                <Header2/>
                <div className="contentDiv">
                    <div className="searchBarDiv">
                        <TextField
                            id="keywords"
                            label="Enter keywords"
                            variant="outlined"
                            fullWidth={true}
                            value={this.state.keywords}
                            onChange={(event) => this.setState({keywords: event.currentTarget.value})}
                        /> 
                        <Button> Generate recs </Button>
                    </div>
                    <div className="sidebarOuterDiv">
                        <div className="sidebarInnerDiv">
                            <Button onClick={() => this.handleGERButton()} > Filter by GERs </Button>
                            { this.state.showGER ? 
                            <div>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-A-II"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='WAY-A-II'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-AQR"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='WAY-AQR'
                                    />                
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-CE"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='WAY-CE'
                                    />     
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-ED"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='WAY-ED'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-ER"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='WAY-ER'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-FR"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='WAY-FR'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-SI"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='WAY-SI'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-SMA"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='WAY-SMA'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Language"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='Language'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Writing 1"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='Writing 1'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Writing 2"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='Writing 2'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Writing SLE"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='Writing SLE'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="DB:EngrAppSci"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                        />}
                                        label='DB:EngrAppSci'
                                    /> 
                                </FormGroup>
                            </div>
                        : null }
                            <div className="filterButtons" >
                            <Button onClick={() => this.handleTermsButton()}> Filter by Terms </Button>
                            </div>
                            {this.state.showTerms ? <div >
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Autumn"
                                            onChange={(event) => this.handleTermsCheckbox(event)}
                                        />}
                                        label='Autumn'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Winter"
                                            onChange={(event) => this.handleTermsCheckbox(event)}
                                        />}
                                        label='Winter'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Spring"
                                            onChange={(event) => this.handleTermsCheckbox(event)}
                                        />}
                                        label='Spring'
                                    />  
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Summer"
                                            onChange={(event) => this.handleTermsCheckbox(event)}
                                        />}
                                        label='Summer'
                                    /> 
                                </FormGroup>
                            </div> : null}
                            <div className="filterButtons" >
                            <Button onClick={() => this.handleUnitsButton()}> Filter by Units </Button>
                            </div>
                            {this.state.showUnits ? <div>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={1}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                        />}
                                        label='1 unit'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={2}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                        />}
                                        label='2 units'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={3}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                        />}
                                        label='3 units'
                                    />  
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={4}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                        />}
                                        label='4 units'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={5}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                        />}
                                        label='5 units'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={100}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                        />}
                                        label='5+ units'
                                    /> 
                                </FormGroup>
                            </div> : null}
                        </div> 
                    </div>
                    <div>{this.state.units}</div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default RecommenderPage; 