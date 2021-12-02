import React, { PureComponent } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NoMatch from './pages/NoMatch';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Games from './pages/Games';
import Books from './pages/Books';
import TvShows from './pages/TvShows';
import { Config } from './config';
import NotificationContainer from './components/NotificationContainer';
import { CssBaseline } from '@material-ui/core';
import Authentication from './models/Authentication';
import AppLoader from './components/layout/AppLoader';
import Form from './components/Login/Form';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// settings
const theme = createMuiTheme(Config.muiThemeMain);
firebase.initializeApp(Config.firebase);

/**
 * Root app component.
 */
class App extends PureComponent {
	state = {
		isLoading: true,
		isSignedIn: false,
	};

	componentDidMount() {
		Authentication.signInListener((isSignedIn) => {
			if (isSignedIn) {
				this.setState({
					isLoading: false,
					isSignedIn: true,
				});
			} else {
				this.setState({
					isLoading: false,
					isSignedIn: false,
				});
			}
		});
	}

	/**
	 * Renders actual app
	 * @return {PureComponent}
	 * @private
	 */
	_renderSignedInApp() {
		return (
			<Router>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/movies" exact component={Movies} />
					<Route path="/games" exact component={Games} />
					<Route path="/books" exact component={Books} />
					<Route path="/tv-shows" exact component={TvShows} />
					<Route component={NoMatch} />
				</Switch>
			</Router>
		);
	}

	/**
	 *
	 * @return {PureComponent|*}
	 * @private
	 */
	_renderApp() {
		const { isLoading, isSignedIn } = this.state;

		if (isLoading) {
			return <AppLoader />;
		} else if (isSignedIn) {
			return this._renderSignedInApp();
		} else {
			return <Form />;
		}
	}

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<NotificationContainer />
				{this._renderApp()}
			</MuiThemeProvider>
		);
	}
}

export default App;
