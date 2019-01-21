import React from 'react';
import Paper from '@material-ui/core/Paper/Paper';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {GET_CURRENT_USER, UPDATE_CURRENT_USER} from "../actions";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Button from "@material-ui/core/Button/Button";
import NotEmptyTextField from "../validatedFields/notEmptyTextField";


const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing.unit / 2,
    },
    textField: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});

class UserProfile extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSubmit = () => {
        const {currentUser, dispatch} = this.props;
        let payload = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email: this.state.email,
        };
        dispatch(testAPICall(`/api/v1/auth/current_user/${currentUser.id}/`,
            UPDATE_CURRENT_USER,
            payload,
            null,
            'PATCH',
            null,
            "Profile Updated"))
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const nextUser = nextProps.currentUser;
        if (nextUser !== undefined) {
            this.setState({
                firstName: nextUser.first_name,
                lastName: nextUser.last_name,
                email: nextUser.email,
            })
        }
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(`/api/v1/auth/current_user/`, GET_CURRENT_USER));
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h4">
                                Your Profile
                            </Typography>
                        </Paper>
                        <div className={classes.spacingDiv}/>
                        <Paper className={classes.paper}>
                            <form>
                                <FormControl fullWidth>
                                    <NotEmptyTextField
                                        required
                                        id="firstName"
                                        label="First Name"
                                        className={classes.textField}
                                        value={this.state.firstName}
                                        onChange={this.handleChange('firstName')}
                                        margin="none"
                                    />
                                    <NotEmptyTextField
                                        required
                                        id="lastName"
                                        label="Last Name"
                                        className={classes.textField}
                                        value={this.state.lastName}
                                        onChange={this.handleChange('lastName')}
                                        margin="none"
                                    />
                                    <NotEmptyTextField
                                        required
                                        id="email"
                                        label="Email"
                                        className={classes.textField}
                                        value={this.state.email}
                                        onChange={this.handleChange('email')}
                                        margin="none"
                                    />
                                </FormControl>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={(event) => {
                                        this.handleSubmit(event)
                                    }}
                                >
                                    Save
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        currentUser: state.authentication.currentUser,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(UserProfile)