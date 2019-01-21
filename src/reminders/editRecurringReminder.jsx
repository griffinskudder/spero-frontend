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
import {CREATE_RECURRING_REMINDER, GET_ACCOUNTS, GET_CATEGORIES, GET_RECURRING_REMINDERS,} from "../actions";
import DialogTitle from "@material-ui/core/DialogTitle/";
import DialogContent from "@material-ui/core/DialogContent/";
import Dialog from "@material-ui/core/Dialog/";
import DialogActions from '@material-ui/core/DialogActions';
import NotEmptyTextField from '../validatedFields/notEmptyTextField';


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
    hiddenTextField: {
        display: 'none',
    }
});

class CreateRecurringReminder extends React.Component {
    state = {
        reminderForm: {
            title: '',
            category: '',
            interval: '',
            day: '',
        },
    };
    accountId = this.props.accountId;
    reminderId = this.props.reminderId;

    handleClose = () => {
        this.props.onClose();
    };

    handleChange = name => event => {
        const reminderForm = Object.assign({}, this.state.reminderForm, {[name]: event.target.value,});
        this.setState({
            reminderForm: reminderForm,
        });
    };

    handleSubmit = () => {
        const {dispatch} = this.props;
        let payload = {
            title: this.state.reminderForm.title,
            category: this.state.reminderForm.category,
            interval: this.state.reminderForm.interval,
            day: this.state.reminderForm.day,
            account: this.accountId,
        };
        let message = "Recurring Alert Created";
        dispatch(testAPICall(`/api/v1/accounts/recurring_reminder/`,
            CREATE_RECURRING_REMINDER,
            payload,
            () => {
                this.handleClose();
                this.setState({
                    reminderForm: {
                        title: '',
                        category: '',
                        interval: 'W',
                        day: '',
                    },
                })
            },
            'POST',
            null,
            message))
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const nextReminder = nextProps.recurringReminders[this.props.reminderId];
        if (nextReminder !== undefined) {
            this.setState({
                reminderForm: {
                    title: nextReminder.title,
                    category: nextReminder.category,
                    interval: nextReminder.interval,
                    day: nextReminder.day,
                }
            })
        }
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(`/api/v1/accounts/recurring_reminder/`, GET_RECURRING_REMINDERS));
        dispatch(testAPICall(`/api/v1/accounts/account/`, GET_ACCOUNTS));
        dispatch(testAPICall(`/api/v1/accounts/category/`, GET_CATEGORIES));
    }

    render() {
        const {accounts, categories, classes, open} = this.props;
        const account = accounts[this.accountId];
        let accountName = "";
        if (account !== undefined) {
            accountName = account.name;
        }
        let validDays = {};
        if (this.state.reminderForm.interval === "W" || this.state.reminderForm.interval === "F") {
            validDays = {
                "1": "Monday",
                "2": "Tuesday",
                "3": "Wednesday",
                "4": "Thursday",
                "5": "Friday",
                "6": "Saturday",
                "7": "Sunday"
            };
        } else {
            for (let i = 1; i <= 28; i++) {
                validDays[i] = i;
            }
        }

        return (
            <Dialog fullWidth={true} onClose={this.handleClose} aria-labelledby="dialog-title" open={open}>
                <DialogTitle id="dialog-title">Recurring Alert for Account - {accountName}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <NotEmptyTextField
                            required
                            id="title"
                            label="Title"
                            className={classes.textField}
                            value={this.state.reminderForm.title}
                            onChange={this.handleChange('title')}
                            margin="none"
                        />
                        <FormControl fullWidth required className={classes.formControl}>
                            <InputLabel htmlFor="type">Category</InputLabel>
                            <Select
                                value={this.state.reminderForm.category}
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
                        <FormControl fullWidth required className={classes.formControl}>
                            <InputLabel htmlFor="type">Interval</InputLabel>
                            <Select
                                value={this.state.reminderForm.interval}
                                onChange={this.handleChange('interval')}
                                name="type"
                                inputProps={{
                                    id: 'category',
                                }}
                                className={classes.selectEmpty}
                            >
                                <MenuItem value={"W"}>Weekly</MenuItem>
                                <MenuItem value={"F"}>Fortnightly</MenuItem>
                                <MenuItem value={"M"}>Monthly</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required className={classes.formControl}>
                            <InputLabel htmlFor="type">Day</InputLabel>
                            <Select
                                value={this.state.reminderForm.day}
                                onChange={this.handleChange('day')}
                                name="type"
                                inputProps={{
                                    id: 'category',
                                }}
                                className={classes.selectEmpty}
                            >
                                {Object.keys(validDays).map((key) => {
                                    return (
                                        <MenuItem key={key} value={key}>
                                            {validDays[key]}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        color="secondary"
                        className={classes.button}
                        onClick={(event) => {
                            this.handleSubmit(event)
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
        categories: state.accounts.categories,
        recurringReminders: state.accounts.recurringReminders,
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
)(CreateRecurringReminder)