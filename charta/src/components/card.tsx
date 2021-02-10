import {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Draggable from 'react-draggable';
import Box from '@material-ui/core/Box';

interface ClassCardProps {
    name: string,
    term: string
}

class ClassCard extends Component<ClassCardProps> {

    render() {
        return (
            <Draggable>
                <Box width={300}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom> {this.props.name} </Typography>
                            <Typography variant="h5" component="h2"> </Typography>
                            <Typography color="textSecondary">{this.props.term}</Typography>
                            <Typography variant="body2" component="p">
                                Reviews

                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </Box>
            </Draggable>
        );
    }

}
  
  


export default ClassCard;
