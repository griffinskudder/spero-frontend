import React from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {testAPICall} from "../reducers";
import {GET_REMINDERS} from "../actions";


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

class AccountHistory extends React.Component {
    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(
            `/api/v1/accounts/reminder/`,
            GET_REMINDERS,
        ))
    }

    render() {
        const {accounts, accountId, categories, logEntries, logEntriesOrder, reminders, users} = this.props;
        let relevantLogEntries = [];
        if (accountId !== undefined) {
            logEntriesOrder.forEach(key => {
                const logEntry = logEntries[key];
                if (String(logEntry.account) === String(accountId) && !logEntry.draft) {
                    relevantLogEntries.push(logEntry);
                }
            });
        }
        else {
            relevantLogEntries = logEntriesOrder.map(key => {
                return logEntries[key]
            })
        }

        if (relevantLogEntries.length === 0) {
            return (
                <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">
                            Log Entries
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        You should do some work -_-
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }
        else {
            return (
                <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">
                            Log Entries
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{maxWidth: '100%', overflowX: 'auto'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Notes
                                    </TableCell>
                                    <TableCell>
                                        Task
                                    </TableCell>
                                    <TableCell>
                                        Category
                                    </TableCell>
                                    <TableCell>
                                        Entry Time
                                    </TableCell>
                                    <TableCell>
                                        User
                                    </TableCell>
                                    <TableCell>
                                        Time Spent
                                    </TableCell>
                                    {(accountId === undefined) &&
                                    (<TableCell>
                                        Account
                                    </TableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {relevantLogEntries.map(logEntry => {
                                    const timeArr = logEntry.time_spent.split(":");
                                    const timeSpent = Number(timeArr[0]) * 60 + Number(timeArr[1]) + Number(timeArr[2]) / 60;
                                    let userName = "";
                                    let user = users[logEntry.created_by];
                                    if (user !== undefined) {
                                        userName = user.first_name + " " + user.last_name;
                                    }
                                    const localDate = new Date(logEntry.modified);
                                    return (
                                        <TableRow key={logEntry.id}>
                                            <TableCell>
                                                {logEntry.description}
                                            </TableCell>
                                            <TableCell>
                                                {(reminders[logEntry.reminder] !== undefined) ? reminders[logEntry.reminder].title : "Note"}
                                            </TableCell>
                                            <TableCell>
                                                {(categories[logEntry.category] !== undefined) ? categories[logEntry.category].name : ""}
                                            </TableCell>
                                            <TableCell>
                                                {localDate.toString().substr(0, 21)}
                                            </TableCell>
                                            <TableCell>
                                                {userName}
                                            </TableCell>
                                            <TableCell>
                                                {timeSpent + "m"}
                                            </TableCell>
                                            {(accountId === undefined) &&
                                            (<TableCell>
                                                {(accounts[logEntry.account] !== undefined) ? accounts[logEntry.account].name : ""}
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
}


const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        categories: state.accounts.categories,
        logEntries: state.accounts.logEntries,
        logEntriesOrder: state.accounts.logEntriesOrder,
        reminders: state.accounts.reminders,
        users: state.authentication.users,
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
)(AccountHistory)