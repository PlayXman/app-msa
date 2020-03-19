import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import PageContent from "../components/layout/PageContent";

class NoMatch extends Component {
	render() {
		return (
			<PageContent>
				<Typography variant="h1">
					404
				</Typography>
			</PageContent>
		);
	}
}

export default NoMatch;
