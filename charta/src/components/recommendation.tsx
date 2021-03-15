import {Component} from "react";
import Tooltip from '@material-ui/core/Tooltip';
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
                      <Tooltip title="We'll suggest courses based on our algorithm.">
                        <Link to={'/recs'}>
                        <Button>Generate recommendations</Button>
                        </Link>
                       </Tooltip>

            </Container>
        )

    }

}

export default Recommendation;