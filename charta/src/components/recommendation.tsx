import {Component} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';



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
            <div>
                <Card>
                   <CardContent>

                       <Button>Generate recommendations</Button>
                   </CardContent>
                </Card>
            </div>
        )

    }

}

export default Recommendation;