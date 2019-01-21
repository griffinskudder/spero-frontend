import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import {connect} from "react-redux";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import Alerts from "../accounts/alerts";
import ToDos from "../accounts/toDos";
import UpcomingAlerts from "../accounts/upcomingAlerts";
import {testAPICall} from "../reducers";
import {GET_ACCOUNTS, GET_ALERTS, GET_CATEGORIES, GET_TODOS} from "../actions";


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
    divider: {
        height: theme.spacing.unit * 2,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit / 2,
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    suggestion: {
        display: 'block'
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none'
    },
    spacingDiv: {
        height: 1 * theme.spacing.unit,
    }
});

class Dashboard extends React.Component {
    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(`/api/v1/accounts/todo/`, GET_TODOS));
        dispatch(testAPICall(`/api/v1/accounts/alert/`, GET_ALERTS));
        dispatch(testAPICall(`/api/v1/accounts/category/`, GET_CATEGORIES));
        dispatch(testAPICall(`/api/v1/accounts/account/`, GET_ACCOUNTS));
    }

    render() {

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Alerts/>
                    </Grid>
                    <Grid item xs={12}>
                        <ToDos/>
                    </Grid>
                    <Grid item xs={12}>
                        <UpcomingAlerts/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        alerts: state.accounts.alerts,
        alertsOrder: state.accounts.alertsOrder,
        toDos: state.accounts.toDos,
        toDosOrder: state.accounts.toDosOrder,
        categories: state.accounts.categories,
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
)(Dashboard)