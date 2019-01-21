import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {CREATE_LOG_ENTRY, UPDATE_LOG_ENTRY,} from "../actions";
import Alerts from "./alerts";
import ToDos from "./toDos";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import NotEmptyTextField from '../validatedFields/notEmptyTextField';
import NotEmptyPositiveNumberField from '../validatedFields/notEmptyPositiveNumberField';


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
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class CreateLogEntry extends React.Component {
    state = {
        logEntryForm: {
            description: '',
            category: '',
            draft: false,
            time_spent: '',
            reminder: '',
            notify: false,
            notify_users: [],
        },
    };

    handleClose = () => {
        this.props.onClose();
    };

    handleChange = name => event => {
        const logEntryForm = Object.assign({}, this.state.logEntryForm, {[name]: event.target.value,});
        this.setState({
            logEntryForm: logEntryForm,
        });
    };

    handleCheckboxChange = name => event => {
        const logEntryForm = Object.assign({}, this.state.logEntryForm, {[name]: event.target.checked,});
        this.setState({
            logEntryForm: logEntryForm,
        });

    };

    handleSubmit = (reminderId) => {
        const {dispatch, alerts, toDos, userId} = this.props;
        let accountId = this.props.accountId;
        let logEntryId = null;
        if (reminderId !== undefined) {
            const alert = alerts[reminderId];
            const toDo = toDos[reminderId];
            if (alert !== undefined) {
                accountId = alert.account;
                logEntryId = alert.log_entry;
            }
            else if (toDo !== undefined) {
                accountId = toDo.account;
                logEntryId = toDo.log_entry;
            }
        }

        let payload = {
            description: this.state.logEntryForm.description,
            category: this.state.logEntryForm.category,
            draft: this.state.logEntryForm.draft,
            time_spent: this.state.logEntryForm.time_spent * 60,
            notify: this.state.logEntryForm.notify,
            notify_users: this.state.logEntryForm.notify_users,
            account: accountId,
            reminder: reminderId,
            created_by: userId,
        };
        if (reminderId === undefined) {
            payload.draft = false;
            payload.reminder = null;
        }
        if (logEntryId === null) {
            dispatch(testAPICall(`/api/v1/accounts/log_entry/`,
                CREATE_LOG_ENTRY,
                payload,
                () => {
                    this.handleClose();
                    this.setState({
                        logEntryForm: {
                            description: '',
                            category: '',
                            draft: false,
                            time_spent: '',
                            reminder: '',
                            notify: false,
                            notify_users: [],
                        },
                    });
                },
                'POST',
                null,
                "Log Entry Created"))
        }
        else {
            dispatch(testAPICall(`/api/v1/accounts/log_entry/${logEntryId}/`,
                UPDATE_LOG_ENTRY,
                payload,
                () => {
                    this.handleClose();
                    this.setState({
                        logEntryForm: {
                            description: '',
                            category: '',
                            draft: false,
                            time_spent: '',
                            reminder: '',
                            notify: false,
                            notify_users: [],
                        },
                    });
                },
                'PATCH',
                null,
                "Log Entry Updated"))
        }

    };

    componentWillReceiveProps(nextProps, nextContext) {
        const reminderId = this.props.reminderId;
        if (reminderId !== undefined) {
            const nextAlert = nextProps.alerts[reminderId];
            const nextToDo = nextProps.toDos[reminderId];
            let logEntryId = undefined;
            if (nextAlert !== undefined) {
                logEntryId = nextAlert.log_entry;
            }
            else if (nextToDo !== undefined) {
                logEntryId = nextToDo.log_entry;
            }
            const nextLogEntry = nextProps.logEntries[logEntryId];
            if (nextLogEntry !== undefined) {
                const timeArr = nextLogEntry.time_spent.split(":");
                const timeSpent = Number(timeArr[0]) * 60 + Number(timeArr[1]) + Number(timeArr[2]) / 60;
                this.setState({
                    logEntryForm: {
                        description: nextLogEntry.description,
                        category: nextLogEntry.category,
                        draft: nextLogEntry.draft,
                        time_spent: timeSpent,
                        account: nextLogEntry.account,
                        notify: nextLogEntry.notify,
                        notify_users: nextLogEntry.notify_users,
                    }
                })
            }
        }
    };

    render() {
        const {alerts, toDos, accounts, customers, categories, reminderId, users, usersOrder, classes, open} = this.props;
        let reminder = "";
        if (reminderId !== undefined) {
            const alert = alerts[reminderId];
            const toDo = toDos[reminderId];

            if (alert !== undefined) {
                reminder = <Alerts alertId={reminderId}/>;
            }
            else if (toDo !== undefined) {
                reminder = <ToDos toDoId={reminderId}/>
            }
        }
        let accountAssignedUsers;
        let customerAssignedUsers;
        if (accounts[this.props.accountId] && customers[accounts[this.props.accountId].customer]) {
            accountAssignedUsers = accounts[this.props.accountId].assigned_users;
            customerAssignedUsers = customers[accounts[this.props.accountId].customer].users
        } else {
            accountAssignedUsers = customerAssignedUsers = [];
        }
        const notifyUsersOptions = usersOrder.filter(userId => {
            return (userId !== this.props.userId && (
                    accountAssignedUsers.includes(userId) ||
                    customerAssignedUsers.includes(userId)
                )
            )
        });
        return (
                <Dialog fullWidth={true} onClose={this.handleClose} aria-labelledby="dialog-title" open={open}>
                    <DialogTitle id="dialog-title">Create Log Entry</DialogTitle>
                    <DialogContent>
                        {reminder}
                        <FormControl fullWidth>
                            <NotEmptyTextField
                                required
                                id="description"
                                label="Description"
                                className={classes.textField}
                                value={this.state.logEntryForm.description}
                                onChange={this.handleChange('description')}
                                margin="none"
                            />
                            {reminderId !== undefined && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.logEntryForm.draft}
                                            onChange={this.handleCheckboxChange('draft')}
                                            value="draft"
                                        />
                                    }
                                    label="Is Draft?"
                                />
                            )}
                            <NotEmptyPositiveNumberField
                                required
                                type="number"
                                id="time_spent"
                                label="Time Spent (Minutes)"
                                className={classes.textField}
                                value={this.state.logEntryForm.time_spent}
                                onChange={this.handleChange('time_spent')}
                                margin="none"
                            />
                            <FormControl fullWidth required className={classes.formControl}>
                                <InputLabel htmlFor="type">Category</InputLabel>
                                <Select
                                    value={this.state.logEntryForm.category}
                                    onChange={this.handleChange('category')}
                                    name="type"
                                    inputProps={{
                                        id: 'category',
                                    }}
                                    className={classes.selectEmpty}
                                >
                                    {Object.keys(categories).map(key => (
                                        <MenuItem
                                            key={categories[key].id}
                                            value={categories[key].id}
                                        >
                                            {categories[key].name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.logEntryForm.notify}
                                        onChange={this.handleCheckboxChange('notify')}
                                        value="notify"
                                    />
                                }
                                label="Notify?"
                            />
                            {this.state.logEntryForm.notify && (
                                <FormControl fullWidth required className={classes.formControl}>
                                    <InputLabel htmlFor="type">Notify Users</InputLabel>
                                    <Select
                                        multiple
                                        value={this.state.logEntryForm.notify_users}
                                        onChange={this.handleChange('notify_users')}
                                        renderValue={selected => {
                                            let names = selected.map((userId) => {
                                                return `${users[userId].first_name} ${users[userId].last_name}`
                                            });
                                            return names.join(', ')
                                        }}
                                        name="type"
                                        inputProps={{
                                            id: 'notify_users',
                                        }}
                                        className={classes.textField}
                                    >
                                        {notifyUsersOptions.map(key => (
                                            <MenuItem
                                                key={users[key].id}
                                                value={users[key].id}
                                            >
                                                {`${users[key].first_name} ${users[key].last_name}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            color="secondary"
                            className={classes.button}
                            onClick={() => {
                                this.handleSubmit(reminderId)
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            );
    }
}


const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        customers: state.accounts.customers,
        userId: state.auth.userId,
        users: state.authentication.users,
        usersOrder: state.authentication.usersOrder,
        categories: state.accounts.categories,
        alerts: state.accounts.alerts,
        toDos: state.accounts.toDos,
        logEntries: state.accounts.logEntries,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

const mobileDialog = withMobileDialog()(CreateLogEntry);

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(mobileDialog)