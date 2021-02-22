import React, {Component} from "react";
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import firebase from "firebase/app";
import "firebase/auth";
import { withRouter } from 'react-router'
import {RouteComponentProps} from "react-router";
import Header from "../components/header";
import Footer from '../components/footer';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import 'firebase/firestore'
import '../firebase';
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';


interface SettingsProps extends RouteComponentProps<any> {
}


interface SettingsState{
    value: number,
    index: number,
    email: string,
    firstName: string,
    edit: boolean
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}


class Settings extends Component<SettingsProps, SettingsState> {

    async componentDidMount() {
        const db = firebase.firestore();
        let user = firebase.auth().currentUser;
        const userRef = db.collection('users').doc(user?.uid);
        const doc = await userRef.get();


        if (!doc.exists) {
            console.log('No such document!');
        } else {
            let email = user?.email ? user?.email : "";

            this.setState({email: email});
            this.setState({firstName: doc.data()?.firstName});

        }
    }

    async updateAccount() {

    }


    constructor(props: SettingsProps) {
        super(props);
        this.state = {value: 0, index: 0, email: '', firstName: '', edit: false}
        this.handleChange = this.handleChange.bind(this);

    }

     handleChange (event: React.ChangeEvent<{}>, newValue: number) {
        this.setState({value: newValue});
    };


    render() {

        return(
            <div className="flex flex-col h-screen justify-between">
                <Header/>
                <Container>
                    <div>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={this.state.value}
                            onChange={this.handleChange}
                            aria-label="Vertical tabs example"
                        >
                            <Tab label="Account" {...a11yProps(0)} />
                            <Tab label="Settings" {...a11yProps(1)} />
                            <Tab label="About" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={this.state.value} index={0}>
                            <div>
                                <h1>Account</h1>

                                <Grid container spacing={3}>
                                    <Grid item xs={8}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            disabled={true}
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            value={this.state.email}
                                            onChange={(evt) => this.setState({email: evt.target.value})}
                                            autoFocus
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <EditIcon/>
                                                    </InputAdornment>
                                                )

                                            }}
                                        />

                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            disabled={true}
                                            fullWidth
                                            id="firstName"
                                            label="First name"
                                            name="name"
                                            autoComplete="name"
                                            value={this.state.firstName}
                                            onChange={(evt) => this.setState({firstName: evt.target.value})}
                                            autoFocus
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <EditIcon/>
                                                    </InputAdornment>
                                                )

                                            }}
                                        />
                                    </Grid>
                                </Grid>


                            </div>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={1}>
                            <div>
                                <h1>Settings</h1>


                            </div>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={2}>
                            <div>
                                <h1>About</h1>
                                <p>Charta is the work of some computer science students making it easier to graduate.</p>
                            </div>
                        </TabPanel>

                    </div>

                </Container>
                <Footer/>
            </div>

        );
    }
}

export default withRouter(Settings);