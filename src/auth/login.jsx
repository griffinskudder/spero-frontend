import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import {loginUser} from '../actions';
import {connect} from "react-redux";

const styles = theme => ({
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    handleKeyPress = (event) => {
        if (String(event.key) === 'Enter') {
            this.handleClick()
        }
    };

    handleClick() {
        const {dispatch} = this.props;
        const credentials = {
            username: this.state.username,
            password: this.state.password
        };
        const redirect = "/";
        dispatch(loginUser(credentials, redirect));
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <CssBaseline/>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockIcon/>
                        </Avatar>
                        <Typography variant="h5">Sign in</Typography>
                        <form className={classes.form}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input id="username"
                                       name="username"
                                       autoComplete="username"
                                       onChange={(event) => this.setState({username: event.target.value})}
                                       autoFocus/>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    id="password"
                                    onChange={(event) => this.setState({password: event.target.value})}
                                    onKeyPress={(event) => this.handleKeyPress(event)}
                                    autoComplete="current-password"
                                />
                            </FormControl>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={(event) => this.handleClick(event)}
                            >
                                Sign in
                            </Button>
                        </form>
                    </Paper>
                </main>
            </React.Fragment>
        );
    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

export default connect(mapDispatchToProps)(withStyles(styles)(SignIn));