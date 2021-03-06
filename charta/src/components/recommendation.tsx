import {Component} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom'


interface RecommendationState  {

}

interface RecommendationProps {

}



class Recommendation extends Component<RecommendationProps , RecommendationState> {

    async generateRecommendations() {
        
    }

    constructor(props: RecommendationProps) {
        super(props);
        this.generateRecommendations = this.generateRecommendations.bind(this);

    }

    render() {
        return (
            <Container>
                <Card>
                   <CardContent>
                       <Link to={'/recs'}>
                       <Button>Generate recommendations</Button>
                       </Link>
                   </CardContent>
                </Card>
            </Container>
        )

    }

}

export default Recommendation;