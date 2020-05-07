import React, { PureComponent } from 'react';
import { Paper, Typography, withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Authentication from '../../models/Authentication';
import Notification from '../../models/Notification';

const style = (theme) => ({
	root: {
		display: 'flex',
		height: '100vh',
		alignItems: 'center',
		justifyContent: 'center',
	},
	wrapper: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		width: '100%',
		maxWidth: '350px',
	},
	btn: {
		marginTop: '1em',
	},
});

/**
 * Login form
 */
class Form extends PureComponent {
	state = {
		email: '',
		pass: '',
		error: false,
	};
	fieldConfig = {
		fullWidth: true,
		required: true,
		margin: 'normal',
		variant: 'outlined',
	};

	/**
	 * Handles input update on change
	 * @param {string} inputName
	 * @return {Function}
	 */
	handleChange = (inputName) => (event) => {
		this.setState({
			error: false,
			[inputName]: event.target.value,
		});
	};

	/**
	 * Handles form submit
	 * @param {Event} e
	 */
	handleSubmit = (e) => {
		e.preventDefault();

		const { email, pass } = this.state;
		const loader = new Notification(true);
		loader.setText('Signing in...');
		loader.show();

		Authentication.signIn(email, pass)
			.catch((err) => {
				console.error(err.message);

				this.setState({
					error: true,
				});
			})
			.finally(() => {
				loader.hide();
			});
	};

	render() {
		const { classes } = this.props;
		const { email, pass, error } = this.state;

		return (
			<div className={classes.root}>
				<Paper elevation={1} className={classes.wrapper}>
					<Typography variant="h4">Sign-in</Typography>
					<form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
						<TextField
							autoFocus
							id="email"
							label="Email"
							type="email"
							value={email}
							onChange={this.handleChange('email')}
							error={error}
							{...this.fieldConfig}
						/>
						<TextField
							id="password"
							label="Password"
							type="password"
							value={pass}
							onChange={this.handleChange('pass')}
							error={error}
							{...this.fieldConfig}
						/>
						<Button
							variant="contained"
							color="primary"
							className={classes.btn}
							type="submit"
						>
							Send
						</Button>
					</form>
				</Paper>
			</div>
		);
	}
}

export default withStyles(style)(Form);
