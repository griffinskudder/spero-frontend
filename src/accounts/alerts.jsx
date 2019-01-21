import React from 'react';
import Table from '@material-ui/core/Table/Table';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CreateLogEntry from "./createLogEntry";
import NavLink from "react-router-dom/NavLink";


const styles = theme => ({
    root: {
        display: 'flex',
        overflowX: 'hide',
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
    table: {
        minWidth: 340,
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

class Alerts extends React.Component {
    state = {
        dialogOpen: false,
        currentAlertId: undefined,
    };

    handleClickOpen = (alertId) => {
        this.setState({
            currentAlertId: alertId,
        });
        this.setState({
            dialogOpen: true,
        });
    };

    handleClose = () => {
        this.setState({
            dialogOpen: false,
        });
    };

    render() {
        const {accounts, alerts, alertsOrder, categories, accountId, alertId} = this.props;
        let relevantAlerts = [];
        if (accountId !== undefined) {
            alertsOrder.forEach(key => {
                const alert = alerts[key];
                if (String(alert.account) === String(accountId)) {
                    relevantAlerts.push(alert);
                }
            });
        }
        else if (alertId !== undefined) {
            relevantAlerts.push(alerts[alertId]);
        }
        else {
            relevantAlerts = alertsOrder.map(key => {
                return alerts[key]
            })
        }

        if (relevantAlerts.length === 0) {
            return (
                <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">
                            {alertId === undefined ? "Alerts" : "Alert"}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        No alerts :)
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }

        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="h6">
                        {alertId === undefined ? "Alerts: " + relevantAlerts.length : "Alert"}
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
                                {alertId === undefined && (
                                    <TableCell>
                                        Age
                                    </TableCell>
                                )}
                                {alertId === undefined && (
                                    <TableCell>
                                        Alert Date
                                    </TableCell>
                                )}
                                {(accountId === undefined && alertId === undefined) &&
                                (<TableCell>
                                    Account
                                </TableCell>)}
                                {(alertId === undefined) &&
                                (<TableCell>
                                    Controls
                                </TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {relevantAlerts.map(alert => {
                                const alertDate = new Date(Date.parse(alert.alert_time));
                                const today = new Date();
                                const _MS_PER_DAY = 1000 * 60 * 60 * 24;
                                const days = Math.ceil((today - alertDate) / _MS_PER_DAY);
                                return (
                                    <TableRow key={alert.id}>
                                        <TableCell>
                                            {alert.title}
                                        </TableCell>
                                        <TableCell>
                                            {(categories[alert.category] !== undefined) ? categories[alert.category].name : ""}
                                        </TableCell>
                                        {alertId === undefined && (
                                            <TableCell>
                                                {days + " days"}
                                            </TableCell>
                                        )}
                                        {alertId === undefined && (
                                            <TableCell>
                                                {alertDate.toDateString()}
                                            </TableCell>
                                        )}
                                        {(accountId === undefined && alertId === undefined) &&
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
                                        {(alertId === undefined) &&
                                        (<TableCell>
                                            <Button variant='contained' color="primary"
                                                    onClick={() => this.handleClickOpen(alert.id)}>
                                                Clear
                                            </Button>
                                        </TableCell>)}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </ExpansionPanelDetails>
                <CreateLogEntry
                    open={this.state.dialogOpen}
                    onClose={() => this.handleClose()}
                    accountId={this.accountId}
                    reminderId={this.state.currentAlertId}
                />
            </ExpansionPanel>
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
)(Alerts)