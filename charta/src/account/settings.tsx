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
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import 'firebase/firestore'
import '../firebase';


interface SettingsProps extends RouteComponentProps<any> {
}


interface SettingsState{
    value: number,
    index: number
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


    constructor(props: SettingsProps) {
        super(props);
        this.state = {value: 0, index: 0}
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