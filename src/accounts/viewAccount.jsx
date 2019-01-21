import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import Alerts from "./alerts";
import ToDos from "./toDos";
import AccountHistory from "./accountHistory";
import UpcomingAlerts from "./upcomingAlerts";
import AccountStats from "./accountStats";
import {
    GET_ACCOUNTS,
    GET_ALERTS,
    GET_CATEGORIES,
    GET_CUSTOMERS,
    GET_LOG_ENTRIES,
    GET_TODOS,
    GET_USERS,
    UPDATE_ACCOUNT
} from "../actions";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import CreateLogEntry from "./createLogEntry";
import CreateReminder from "../reminders/createReminder";
import NotEmptyTextField from "../validatedFields/notEmptyTextField";
import NotEmptyURLTextField from "../validatedFields/notEmptyURLTextField";
import PositiveNumberNotEmptyField from "../validatedFields/notEmptyPositiveNumberField";
import RecurringReminders from "../reminders/recurringReminders";


const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: "auto",
    },
    textField: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    button: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    fabTop: {
        position: 'fixed',
        bottom: theme.spacing.unit * 10,
        right: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class ViewAccount extends React.Component {
    state = {
        accountForm: {
            name: '',
            url: '',
            customer: '',
            google_ads_id: '',
            google_analytics_id: '',
            google_tag_manager_code: '',
            search_monthly_budget: '',
            notes: '',
            assigned_users: [],
        },
        logEntryDialogOpen: false,
        reminderDialogOpen: false,
    };

    handleClickLogEntryOpen = () => {
        this.setState({
            logEntryDialogOpen: true,
        });
    };

    handleClickReminderOpen = () => {
        this.setState({
            reminderDialogOpen: true,
        });
    };

    handleLogEntryClose = () => {
        this.setState({logEntryDialogOpen: false});
    };

    handleReminderClose = () => {
        this.setState({reminderDialogOpen: false});
    };
    handleChange = name => event => {
        const accountForm = Object.assign({}, this.state.accountForm, {[name]: event.target.value,});
        this.setState({
            accountForm: accountForm,
        });
    };

    handleSubmit = () => {
        const {dispatch} = this.props;
        let payload = {
            name: this.state.accountForm.name,
            url: this.state.accountForm.url,
            customer: this.state.accountForm.customer,
            google_ads_id: this.state.accountForm.google_ads_id,
            google_analytics_id: this.state.accountForm.google_analytics_id,
            google_tag_manager_code: this.state.accountForm.google_tag_manager_code,
            search_monthly_budget: this.state.accountForm.search_monthly_budget,
            notes: this.state.accountForm.notes,
            assigned_users: this.state.accountForm.assigned_users
        };
        dispatch(testAPICall(`/api/v1/accounts/account/${this.accountId}/`,
            UPDATE_ACCOUNT,
            payload,
            null,
            'PATCH',
            null,
            "Account Updated"))
    };
    accountId = this.props.id;

    componentWillReceiveProps(nextProps, nextContext) {
        const nextAccount = nextProps.accounts[this.accountId];
        if (nextAccount !== undefined) {
            let notes;
            if (nextAccount.notes === null) {
                notes = "";
            }
            else {
                notes = nextAccount.notes;
            }
            this.setState({
                accountForm: {
                    name: nextAccount.name,
                    url: nextAccount.url,
                    customer: nextAccount.customer,
                    google_ads_id: nextAccount.google_ads_id,
                    google_analytics_id: nextAccount.google_analytics_id,
                    google_tag_manager_code: nextAccount.google_tag_manager_code,
                    search_monthly_budget: nextAccount.search_monthly_budget,
                    notes: notes,
                    assigned_users: nextAccount.assigned_users,
                }
            })
        }
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(`/api/v1/accounts/account/`, GET_ACCOUNTS));
        dispatch(testAPICall(`/api/v1/auth/user/`, GET_USERS));
        dispatch(testAPICall(`/api/v1/accounts/customer/`, GET_CUSTOMERS));
        dispatch(testAPICall(`/api/v1/accounts/category/`, GET_CATEGORIES));
        dispatch(testAPICall(`/api/v1/accounts/todo/`, GET_TODOS));
        dispatch(testAPICall(`/api/v1/accounts/alert/`, GET_ALERTS));
        dispatch(testAPICall(`/api/v1/accounts/log_entry/`, GET_LOG_ENTRIES));
    }

    render() {
        const {accounts, customers, customersOrder, users, classes} = this.props;

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <AccountStats
                            accountName={accounts[this.accountId] !== undefined ? accounts[this.accountId].name : ""}
                            accountId={this.accountId}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant="h6">
                                    Account Details
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.root} elevation={1}>
                            <form>
                                <FormControl fullWidth>
                                    <NotEmptyTextField
                                        required
                                        id="name"
                                        label="Name"
                                        className={classes.textField}
                                        value={this.state.accountForm.name}
                                        onChange={this.handleChange('name')}
                                        margin="none"
                                    />
                                    <NotEmptyURLTextField
                                        required
                                        id="url"
                                        label="URL"
                                        className={classes.textField}
                                        value={this.state.accountForm.url}
                                        onChange={this.handleChange('url')}
                                        margin="none"
                                    />
                                    <FormControl fullWidth required className={classes.formControl}>
                                        <InputLabel htmlFor="type">Customer</InputLabel>
                                        <Select
                                            value={this.state.accountForm.customer}
                                            onChange={this.handleChange('customer')}
                                            name="type"
                                            inputProps={{
                                                id: 'customer',
                                            }}
                                        >
                                            {customersOrder.map(key => (
                                                <MenuItem
                                                    key={customers[key].id}
                                                    value={customers[key].id}
                                                >
                                                    {customers[key].name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <NotEmptyTextField
                                        required
                                        id="google_ads_id"
                                        label="Google Ads ID"
                                        className={classes.textField}
                                        value={this.state.accountForm.google_ads_id}
                                        onChange={this.handleChange('google_ads_id')}
                                        margin="none"
                                    />
                                    <NotEmptyTextField
                                        required
                                        id="google_analytics_id"
                                        label="Google Analytics ID"
                                        className={classes.textField}
                                        value={this.state.accountForm.google_analytics_id}
                                        onChange={this.handleChange('google_analytics_id')}
                                        margin="none"
                                    />
                                    <NotEmptyTextField
                                        required
                                        id="google_tag_manager_code"
                                        label="GTM Code"
                                        className={classes.textField}
                                        value={this.state.accountForm.google_tag_manager_code}
                                        onChange={this.handleChange('google_tag_manager_code')}
                                        margin="none"
                                    />
                                    <PositiveNumberNotEmptyField
                                        required
                                        type="number"
                                        id="search_monthly_budget"
                                        label="Search Monthly Budget"
                                        className={classes.textField}
                                        value={this.state.accountForm.search_monthly_budget}
                                        onChange={this.handleChange('search_monthly_budget')}
                                        margin="none"
                                    />
                                    <NotEmptyTextField
                                        required
                                        multiline
                                        rows={4}
                                        id="notes"
                                        label="Notes"
                                        className={classes.textField}
                                        value={this.state.accountForm.notes}
                                        onChange={this.handleChange('notes')}
                                        margin="none"
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel html-for="assigned_users">Assigned Users</InputLabel>
                                        <Select
                                            multiple
                                            value={this.state.accountForm.assigned_users}
                                            onChange={this.handleChange('assigned_users')}
                                            renderValue={selected => {
                                                let names = selected.map((userId) => {
                                                    let user = users[userId];
                                                    if (user) {
                                                        return `${user.first_name} ${user.last_name}`;
                                                    }
                                                    return ""
                                                });
                                                return names.join(', ')
                                            }}
                                            name="assigned_users"
                                            className={classes.textField}
                                            inputProps={{
                                                id: 'assigned_users',
                                            }}
                                        >
                                            {Object.keys(users).map(key => (
                                                <MenuItem
                                                    key={users[key].id}
                                                    value={users[key].id}
                                                >
                                                    {`${users[key].first_name} ${users[key].last_name}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ToDos accountId={this.accountId}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Alerts accountId={this.accountId}/>
                    </Grid>
                    <Grid item xs={12}>
                        <UpcomingAlerts accountId={this.accountId}/>
                    </Grid>
                    <Grid item xs={12}>
                        <AccountHistory accountId={this.accountId}/>
                    </Grid>
                    <Grid item xs={12}>
                        <RecurringReminders accountId={this.accountId}/>
                    </Grid>
                </Grid>
                <Tooltip title="Add Reminder" placement="left">
                    <Fab
                        onClick={this.handleClickReminderOpen}
                        className={classes.fab}
                        color="secondary"
                    >
                        <AddIcon/>
                    </Fab>
                </Tooltip>
                <Tooltip title="Add Log Entry" placement="left">
                    <Fab
                        onClick={this.handleClickLogEntryOpen}
                        className={classes.fabTop}
                        color="primary"
                    >
                        <AddIcon/>
                    </Fab>
                </Tooltip>
                <CreateLogEntry
                    open={this.state.logEntryDialogOpen}
                    onClose={this.handleLogEntryClose}
                    accountId={this.accountId}
                />
                <CreateReminder
                    open={this.state.reminderDialogOpen}
                    onClose={this.handleReminderClose}
                    id={this.accountId}
                />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        users: state.authentication.users,
        customers: state.accounts.customers,
        customersOrder: state.accounts.customersOrder,
        alerts: state.accounts.alerts,
        alertsOrder: state.accounts.alertsOrder,
        toDosOrder: state.accounts.toDosOrder,
        toDos: state.accounts.toDos,
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
)(ViewAccount)