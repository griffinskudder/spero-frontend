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
import {DELETE_RECURRING_REMINDER, GET_ACCOUNTS, GET_CATEGORIES, GET_RECURRING_REMINDERS} from "../actions";
import Button from "@material-ui/core/Button/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditRecurringReminder from "./editRecurringReminder";
import CreateRecurringReminder from "./createRecurringReminder";
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

class RecurringReminders extends React.Component {
    state = {
        dialogOpen: false,
        createOpen: false,
        currentReminderId: undefined,
    };

    handleClickOpen = (reminderId) => {
        this.setState({
            currentReminderId: reminderId,
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
    handleCreateClose = () => {
        this.setState({
            createOpen: false,
        });
    };

    handleDelete = (reminderId) => {
        const {dispatch} = this.props;
        const callBack = () => {
            dispatch(testAPICall(`/api/v1/accounts/recurring_reminder/`, GET_RECURRING_REMINDERS))
        };
        dispatch(testAPICall(`/api/v1/accounts/recurring_reminder/${reminderId}/`,
            DELETE_RECURRING_REMINDER,
            null,
            callBack,
            'DELETE',
            null,
            "Recurring reminder deleted."))
    };

    componentWillMount() {
        const {dispatch, accountId} = this.props;
        dispatch(testAPICall(`/api/v1/accounts/recurring_reminder/`, GET_RECURRING_REMINDERS));
        dispatch(testAPICall(`/api/v1/accounts/category/`, GET_CATEGORIES));
        if (accountId === undefined) {
            dispatch(testAPICall(`/api/v1/accounts/account/`, GET_ACCOUNTS));
        }
    }

    render() {
        const {accounts, recurringReminders, recurringRemindersOrder, categories, accountId, reminderId} = this.props;

        let relevantReminders = [];
        if (accountId !== undefined) {
            recurringRemindersOrder.forEach(key => {
                const alert = recurringReminders[key];
                if (String(alert.account) === String(accountId)) {
                    relevantReminders.push(alert);
                }
            });
        } else if (reminderId !== undefined) {
            relevantReminders.push(recurringReminders[reminderId]);
        } else {
            relevantReminders = recurringRemindersOrder.map(key => {
                return recurringReminders[key]
            })
        }

        if (relevantReminders.length === 0) {
            return (
                <ExpansionPanel defaultExpanded={false}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">
                            {reminderId === undefined ? "Recurring Reminders" : "Recurring Reminder"}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Button variant='contained' color='secondary'
                                onClick={() => this.setState({createOpen: true})}>
                            Add Recurring Reminder
                        </Button>
                    </ExpansionPanelDetails>
                    <CreateRecurringReminder
                        open={this.state.createOpen}
                        onClose={() => this.handleCreateClose()}
                        accountId={accountId}
                    />
                </ExpansionPanel>
            )
        }

        return (
            <ExpansionPanel defaultExpanded={false}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="h6">
                        {reminderId === undefined ? "Recurring Reminders:" : "Recurring Reminder"}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
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
                                    Interval
                                </TableCell>
                                <TableCell>
                                    Day
                                </TableCell>
                                {(accountId === undefined && reminderId === undefined) &&
                                (<TableCell>
                                    Account
                                </TableCell>)}
                                {(reminderId === undefined) &&
                                (<TableCell>
                                    Controls
                                </TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {relevantReminders.map(reminder => {
                                let interval;
                                const DAYS = {
                                    "1": "Monday",
                                    "2": "Tuesday",
                                    "3": "Wednesday",
                                    "4": "Thursday",
                                    "5": "Friday",
                                    "6": "Saturday",
                                    "7": "Sunday"
                                };
                                let day;
                                if (reminder.interval === "W") {
                                    interval = "Weekly";
                                    day = DAYS[reminder.day];
                                } else if (reminder.interval === "F") {
                                    interval = "Fortnightly";
                                    day = DAYS[reminder.day];
                                } else {
                                    interval = "Monthly";
                                    day = reminder.day;
                                }
                                return (
                                    <TableRow key={reminder.id}>
                                        <TableCell>
                                            {reminder.title}
                                        </TableCell>
                                        <TableCell>
                                            {(categories[reminder.category] !== undefined) ? categories[reminder.category].name : ""}
                                        </TableCell>
                                        <TableCell>
                                            {interval}
                                        </TableCell>
                                        <TableCell>
                                            {day}
                                        </TableCell>
                                        {(accountId === undefined && reminderId === undefined) &&
                                        (<TableCell>
                                            {(accounts[reminder.account] !== undefined) ?
                                                <Button style={{
                                                    textTransform: 'inherit',
                                                    font: 'inherit',
                                                    textAlign: 'left',
                                                    paddingLeft: 0,
                                                }}
                                                        component={NavLink}
                                                        to={`/accounts/${reminder.account}`}>
                                                    {accounts[reminder.account].name}
                                                </Button>
                                                : ""}
                                        </TableCell>)}
                                        {(reminderId === undefined) &&
                                        (<TableCell>
                                            <IconButton onClick={() => this.handleClickOpen(reminder.id)}>
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton onClick={() => this.handleDelete(reminder.id)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>)}
                                    </TableRow>
                                )
                            })}
                            <TableRow>
                                <TableCell>
                                    <Button variant='contained' color='secondary'
                                            onClick={() => this.setState({createOpen: true})}>
                                        Add Recurring Reminder
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table> <br/>

                </ExpansionPanelDetails>
                <EditRecurringReminder
                    open={this.state.dialogOpen}
                    onClose={() => this.handleClose()}
                    accountId={accountId}
                    reminderId={this.state.currentReminderId}
                />
                <CreateRecurringReminder
                    open={this.state.createOpen}
                    onClose={() => this.handleCreateClose()}
                    accountId={accountId}
                />
            </ExpansionPanel>
        );
    }
}


const mapStateToProps = state => {
    return {
        recurringReminders: state.accounts.recurringReminders,
        recurringRemindersOrder: state.accounts.recurringRemindersOrder,
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
)(RecurringReminders)