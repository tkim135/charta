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
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
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

        </Card>
        );
    }
}

interface RecommenderPageProps {
}

interface RecommenderPageState {
    loading: boolean, 
    shouldShowRecs: boolean,

    keywords: string,
    gers: Array<string>,
    terms: Array<string>,
    units: Array<number>,
    recommendations: Array<Course>,

    showGER: boolean,
    showTerms: boolean, 
    showUnits: boolean,

    checkedReqs: Array<boolean>,
    checkedUnits: Array<boolean>,
    checkedTerms: Array<boolean>,

    startOfResults: number, 
    numResults: number,

    invalidParams: boolean,
    shouldRefresh: boolean
}

class RecommenderPage extends Component<RecommenderPageProps, RecommenderPageState>{
    constructor (props: RecommenderPageProps) {
        super(props); 
        
        let course =   new Course("", [], "", [], "", 0, 0, [], [], "");

        let _checkedReqs = new Array(24)
        let _checkedTerms = new Array(4)
        let _checkedUnits = new Array(6)

        this.state = {
            keywords: '', 
            gers: [], 
            terms: [], 
            units: [],
            recommendations: [course], 
            showGER: false, 
            showTerms: false,
            showUnits: false,
            loading: false,
            shouldShowRecs: false,

            // there's definitely a better way to do this...
            // checkedReqs: [false, false, false, false, false, false, false, false, false, false, false, false, false],
            checkedReqs: _checkedReqs.fill(false),
            checkedTerms: _checkedTerms.fill(false),
            checkedUnits: _checkedUnits.fill(false), 

            startOfResults: 0,
            numResults: 5,
            
            invalidParams: false,
            shouldRefresh: true
        }; 
        this.renderCourseCard = this.renderCourseCard.bind(this)
    }


    handleGERCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
        var checkedStates = this.state.checkedReqs
        checkedStates[parseInt(event.target.id)] = event.currentTarget.checked
        this.setState({checkedReqs: checkedStates})


        if (event.target.checked && !this.state.gers.includes(event.target.value)) {
            // this.state.checkedReqs[event.target.id] = true
            this.setState({gers: [...this.state.gers, event.target.value]}); 
        } else {
            if (this.state.gers.includes(event.target.value)) {
                // event.target.checked = false;
                // this.state.checkedReqs[event.target.id] = false
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
        var checkedStates = this.state.checkedTerms;
        checkedStates[parseInt(event.target.id)] = event.currentTarget.checked 
        this.setState({checkedTerms: checkedStates})

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
        var checkedStates = this.state.checkedUnits;
        checkedStates[parseInt(event.target.id)] = event.currentTarget.checked 
        this.setState({checkedUnits: checkedStates})

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

    async handleGenerateRecommendations() {
        console.log(this.state.gers, this.state.units, this.state.terms, this.state.keywords)
        if (this.state.gers.length === 0 && this.state.units.length === 0 && this.state.terms.length === 0 && this.state.keywords === '') {
            // add an alert
            this.setState({invalidParams: true})
            console.log("no parameters!")
        } else {
            let query: any = {}
            if (this.state.gers.length > 0) {
                query["reqs"] = this.state.gers
            } 
            if (this.state.units.length > 0) { 
                query["units"] = this.state.units
            }
            if (this.state.keywords.length > 0) {
                console.log("keywords: ", this.state.keywords)
                query["keywords"] = this.state.keywords
                // this.setState({keywords: '',})
            }
            if (this.state.terms.length > 0) {
                query["terms"] = this.state.terms.join() 
            }
            query["start"] = this.state.startOfResults
            query["numResults"] = this.state.numResults

            var generateRecommendations = firebase.functions().httpsCallable('recommendation')

            this.setState({loading: true, recommendations: []})
            // if (this.state.shouldRefresh === true) {
            //     this.setState({recommendations: []})
            // }
      
            let res = await generateRecommendations(query)
            
            res.data.forEach((courseElements: any) => {
                console.log(courseElements)
                if (courseElements != null){
                    const course = new Course(
                        courseElements['id'],
                        courseElements["Codes"],
                        courseElements["Description"],
                        courseElements["GER"],
                        courseElements["Grading Basis"],
                        courseElements["Min Units"],
                        courseElements["Max Units"],
                        [],
                        courseElements["Terms"],
                        courseElements["Title"]

                    );
                    
                    this.state.recommendations.push(course)
                }
            });
            // var finalRecommendations = this.state.recommendations
            // finalRecommendations.shift()
            this.setState({shouldShowRecs: true, loading: false})
            if (this.state.shouldRefresh === true){
                this.setState({startOfResults: 0})
            }
            console.log("keywords: ", this.state.keywords)

            console.log(this.state.recommendations)
        }
    }

    handleResendQuery() {

    }

    async handleShowMore() {
        this.setState({startOfResults: this.state.startOfResults + this.state.numResults})
        if (this.state.startOfResults >= this.state.recommendations.length){
           this.setState({shouldRefresh: false})
           await this.handleGenerateRecommendations()
        }
        console.log(this.state.startOfResults)
    }
    


    renderCourseCard = (course: Course) => {
        return(
            <CourseCard course={course} />
        )
    }

    render() {
        return (
            <div className="flex flex-col h-screen justify-between mainContent">
                <Header/>
                <div className="contentDiv">
                    <div className="searchBarDiv">
                        <TextField
                            id="keywords"
                            label="Enter keywords"
                            variant="outlined"
                            fullWidth={true}
                            value={this.state.keywords}
                            onChange={(event) => this.setState({keywords: event.target.value})}
                        /> 
                        <Button onClick= {() => this.handleGenerateRecommendations()}> Generate recs </Button>

                    </div>
                    <div className="sidebarOuterDiv">
                        <Container className="containerStyle">
                            <Grid container spacing={3} justify='center' >
                                {this.state.loading ? <div className="loadingDiv"><CircularProgress/></div> : 
                                    null
                                } 
                                {this.state.shouldShowRecs && !this.state.loading ?
                                    <Grid> 
                                        {this.state.recommendations.slice(0, this.state.startOfResults+this.state.numResults).map(this.renderCourseCard)}
                                        {console.log(this.state.recommendations)}
                                        {/* <CourseCard course={this.state.recommendations[3]}/>  */}
                                        <div className="showMoreDiv">
                                            <Button onClick={() => this.handleShowMore()}>
                                                {/* // onClick={() => this.state.recommendations.slice(this.state.startOfResults, this.state.startOfResults + this.state.numResults).map(this.renderCourseCard)}>  */}
                                                View more results 
                                            </Button>
                                        </div>
                                    </Grid> 
                                : null}
                            </Grid>
                        </Container>

                        <div className="sidebarInnerDiv">
                            <Button onClick={() => this.handleGERButton()} > Filter by GERs </Button>
                            { this.state.showGER ? <div>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-A-II"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='0'
                                            checked={this.state.checkedReqs[0]}
                                        />}
                                        label='WAY-A-II'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-AQR"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='1'
                                            checked={this.state.checkedReqs[1]}
                                        />}
                                        label='WAY-AQR'
                                    />                
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-CE"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='2'
                                            checked={this.state.checkedReqs[2]}
                                        />}
                                        label='WAY-CE'
                                    />     
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-ED"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='3'
                                            checked={this.state.checkedReqs[3]}
                                        />}
                                        label='WAY-ED'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-ER"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='4'
                                            checked={this.state.checkedReqs[4]}
                                        />}
                                        label='WAY-ER'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-FR"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='5'
                                            checked={this.state.checkedReqs[5]}
                                        />}
                                        label='WAY-FR'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-SI"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='6'
                                            checked={this.state.checkedReqs[6]}
                                        />}
                                        label='WAY-SI'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="WAY-SMA"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='7'
                                            checked={this.state.checkedReqs[7]}
                                        />}
                                        label='WAY-SMA'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Language"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='8'
                                            checked={this.state.checkedReqs[8]}
                                        />}
                                        label='Language'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Writing 1"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='9'
                                            checked={this.state.checkedReqs[9]}
                                        />}
                                        label='Writing 1'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Writing 2"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='10'
                                            checked={this.state.checkedReqs[10]}
                                        />}
                                        label='Writing 2'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Writing SLE"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='11'
                                            checked={this.state.checkedReqs[11]}
                                        />}
                                        label='Writing SLE'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="DB:Hum"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='13'
                                            checked={this.state.checkedReqs[13]}
                                        />}
                                        label='DB:Hum'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="DB:Mtath"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='14'
                                            checked={this.state.checkedReqs[14]}
                                        />}
                                        label='DB:Math'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="DB:SocSci"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='15'
                                            checked={this.state.checkedReqs[15]}
                                        />}
                                        label='DB:SocSci'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="DB:EngrAppSci"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='12'
                                            checked={this.state.checkedReqs[12]}
                                        />}
                                        label='DB:EngrAppSci'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="DB:NatSci"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='16'
                                            checked={this.state.checkedReqs[16]}
                                        />}
                                        label='DB:NatSci'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="EC:EthicReas"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='17'
                                            checked={this.state.checkedReqs[17]}
                                        />}
                                        label='EC:EthicReas'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="EC:GlobalCom"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='18'
                                            checked={this.state.checkedReqs[18]}
                                        />}
                                        label='EC:GlobalCom'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="EC:AmerCul"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='19'
                                            checked={this.state.checkedReqs[19]}
                                        />}
                                        label='EC:AmerCul'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="EC:Gender"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='20'
                                            checked={this.state.checkedReqs[20]}
                                        />}
                                        label='EC:Gender'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="IHUM1"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='21'
                                            checked={this.state.checkedReqs[21]}
                                        />}
                                        label='IHUM1'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="IHUM2"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='22'
                                            checked={this.state.checkedReqs[22]}
                                        />}
                                        label='IHUM2'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="IHUM3"
                                            onChange={(event) => this.handleGERCheckbox(event)}
                                            id='23'
                                            checked={this.state.checkedReqs[23]}
                                        />}
                                        label='IHUM3'
                                    />

                                </FormGroup>
                            </div> : null }

                            <div className="filterButtons" >
                            <Button onClick={() => this.handleTermsButton()}> Filter by Terms </Button>
                            </div>
                            {this.state.showTerms ? <div >
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Autumn"
                                            onChange={(event) => this.handleTermsCheckbox(event)}
                                            checked={this.state.checkedTerms[0]}
                                            id='0'
                                        />}
                                        label='Autumn'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Winter"
                                            onChange={(event) => this.handleTermsCheckbox(event)}
                                            checked={this.state.checkedTerms[1]}
                                            id='1'
                                        />}
                                        label='Winter'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Spring"
                                            onChange={(event) => this.handleTermsCheckbox(event)}
                                            checked={this.state.checkedTerms[2]}
                                            id='2'
                                        />}
                                        label='Spring'
                                    />  
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value="Summer"
                                            onChange={(event) => this.handleTermsCheckbox(event)}
                                            checked={this.state.checkedTerms[3]}
                                            id='3'
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
                                            checked={this.state.checkedUnits[0]}
                                            id='0'
                                        />}
                                        label='1 unit'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={2}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                            checked={this.state.checkedUnits[1]}
                                            id='1'
                                        />}
                                        label='2 units'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={3}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                            checked={this.state.checkedUnits[2]}
                                            id='2'
                                        />}
                                        label='3 units'
                                    />  
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={4}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                            checked={this.state.checkedUnits[3]}
                                            id='3'
                                        />}
                                        label='4 units'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={5}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                            checked={this.state.checkedUnits[4]}
                                            id='4'
                                        />}
                                        label='5 units'
                                    /> 
                                    <FormControlLabel
                                        control={<Checkbox 
                                            value={100}
                                            onChange={(event) => this.handleUnitsCheckbox(event)}
                                            checked={this.state.checkedUnits[5]}
                                            id='5'
                                        />}
                                        label='5+ units'
                                    /> 
                                </FormGroup>
                            </div> : null}
                        </div> 

                    </div>
                    <div>
                    <Snackbar onClose={() => this.setState({invalidParams: false})}
                        open={this.state.invalidParams} autoHideDuration={2000}>
                        <MuiAlert severity="warning">
                            Please enter some keywords, GERS, terms or units.
                        </MuiAlert>
                    </Snackbar>
                    </div>

                </div>
                <Footer/>
            </div>
        );
    }
}

export default RecommenderPage; 
