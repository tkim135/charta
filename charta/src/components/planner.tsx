import {Component} from 'react';
import Quarter from './quarter';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

class Planner extends Component {



    render() {
        const terms = ['Fall 2017',
                         'Winter 2017',
                         'Spring 2018',
                          'Fall 2018',
                          'Winter 2019',
                          'Spring 2019',
                          'Fall 2019',
                            'Winter 2020',
                           'Spring 2020',
                            'Fall 2020',
                            'Winter 2021',
                            'Spring 2021']

        return(
            <div>
                <h1>Courses</h1>
                <Grid container spacing={3}>

                    <Grid item xs={4}>
                        <Quarter quarter={'Fall 2017'}/>
                        <Quarter quarter={'Fall 2018'}/>
                        <Quarter quarter={'Fall 2019'}/>
                        <Quarter quarter={'Fall 2020'}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Quarter quarter={'Winter 2018'}/>
                        <Quarter quarter={'Winter 2019'}/>
                        <Quarter quarter={'Winter 2020'}/>
                        <Quarter quarter={'Winter 2021'}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Quarter quarter={'Spring 2018'}/>
                        <Quarter quarter={'Spring 2019'}/>
                        <Quarter quarter={'Spring 2020'}/>
                        <Quarter quarter={'Spring 2021'}/>

                    </Grid>

                </Grid>
                    {/*{terms.map((term) => <Quarter quarter={term}/>)}*/}

            </div>
        );
    }


}


export default Planner;