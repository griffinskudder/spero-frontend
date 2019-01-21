import React from 'react';
import Table from '@material-ui/core/Table/Table';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {GET_UPCOMING_ALERTS} from "../actions";
import Button from "@material-ui/core/Button/Button";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavLink from "react-router-dom/NavLink";


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

class UpcomingAlerts extends React.Component {

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(`/api/v1/accounts/future_alert/`, GET_UPCOMING_ALERTS));
    }

    render() {
        const {accounts, upcomingAlerts, upcomingAlertsOrder, categories, accountId} = this.props;
        let relevantAlerts = [];
        if (accountId !== undefined) {
            upcomingAlertsOrder.forEach(key => {
                const alert = upcomingAlerts[key];
                if (String(alert.account) === String(accountId)) {
                    relevantAlerts.push(alert);
                }
            });
        }
        else {
            upcomingAlertsOrder.forEach(key => {
                relevantAlerts.push(upcomingAlerts[key]);
            })
        }

        if (relevantAlerts.length === 0) {
            return (
                <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">
                            Upcoming Alerts
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        No upcoming alerts :)
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }

        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="h6">
                        Upcoming Alerts
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{maxWidth: '100%', overflowX: 'auto'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Title
                                </TableCell>
                                <TableCell>
                                    Category
                                </TableCell>
                                <TableCell>
                                    Alert Date
                                </TableCell>
                                {(accountId === undefined) &&
                                (<TableCell>
                                    Account
                                </TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {relevantAlerts.map(alert => {
                                const alertDate = new Date(Date.parse(alert.alert_time));
                                return (
                                    <TableRow key={alert.id}>
                                        <TableCell>
                                            {alert.title}
                                        </TableCell>
                                        <TableCell>
                                            {(categories[alert.category] !== undefined) ? categories[alert.category].name : ""}
                                        </TableCell>
                                        <TableCell>
                                            {alertDate.toDateString()}
                                        </TableCell>
                                        {(accountId === undefined) &&
                                        (<TableCell>
                                            {(accounts[alert.account] !== undefined) ?
                                                <Button style={{
                                                    textTransform: 'inherit',
                                                    font: 'inherit',
                                                    textAlign: 'left',
                                                    paddingLeft: 0,
                                                }}
                                                        component={NavLink}
                                                        to={`/accounts/${alert.account}`}>
                                                    {accounts[alert.account].name}
                                                </Button>
                                                : ""}
                                        </TableCell>)}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}


const mapStateToProps = state => {
    return {
        upcomingAlerts: state.accounts.upcomingAlerts,
        upcomingAlertsOrder: state.accounts.upcomingAlertsOrder,
        toDos: state.accounts.toDos,
        toDosOrder: state.accounts.toDosOrder,
        categories: state.accounts.categories,
        accounts: state.accounts.accounts,
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
)(UpcomingAlerts)