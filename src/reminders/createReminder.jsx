import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {CREATE_ALERT, CREATE_TODO, CREATE_UPCOMING_ALERT,} from "../actions";
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

class CreateReminder extends React.Component {
    state = {
        reminderForm: {
            title: '',
            alert_time: '',
            is_todo: false,
            category: '',
        },
    };

    handleClose = () => {
        this.props.onClose();
    };

    handleChange = name => event => {
        const reminderForm = Object.assign({}, this.state.reminderForm, {[name]: event.target.value,});
        this.setState({
            reminderForm: reminderForm,
        });
    };

    handleCheckboxChange = name => event => {
        const reminderForm = Object.assign({}, this.state.reminderForm, {[name]: event.target.checked,});
        this.setState({
            reminderForm: reminderForm,
        });

    };

    handleSubmit = () => {
        const {dispatch} = this.props;
        let payload = {
            title: this.state.reminderForm.title,
            is_todo: this.state.reminderForm.is_todo,
            category: this.state.reminderForm.category,
            account: this.accountId,
        };
        let message = "To Do Created";
        let type = CREATE_TODO;
        const alertDate = new Date(this.state.reminderForm.alert_time);
        const currentDate = new Date();
        if (!this.state.reminderForm.is_todo) {
            type = CREATE_ALERT;
            if (alertDate > currentDate) {
                type = CREATE_UPCOMING_ALERT;
            }
            payload['alert_time'] = this.state.reminderForm.alert_time;
            message = "Alert Created";
        }
        dispatch(testAPICall(`/api/v1/accounts/alert/`,
            type,
            payload,
            () => {
                this.handleClose();
                this.setState({
                    reminderForm: {
                        title: '',
                        alert_time: '',
                        is_todo: false,
                        category: '',
                    }
                })
            },
            'POST',
            null,
            message))
    };
    accountId = this.props.id;

    render() {
        const {accounts, categories, classes, open} = this.props;
        const account = accounts[this.accountId];
        let accountName = "";
        if (account !== undefined) {
            accountName = account.name;
        }
        return (
            <Dialog fullWidth={true} onClose={this.handleClose} aria-labelledby="dialog-title" open={open}>
                <DialogTitle id="dialog-title">Alert for Account - {accountName}</DialogTitle>
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.reminderForm.is_todo}
                                    onChange={this.handleCheckboxChange('is_todo')}
                                    value="is_todo"
                                />
                            }
                            label="Is Todo?"
                        />
                        <TextField
                            required
                            id="alert_time"
                            label="Alert Date"
                            className={!this.state.reminderForm.is_todo ? classes.textField : classes.hiddenTextField}
                            value={this.state.reminderForm.alert_time}
                            onChange={this.handleChange('alert_time')}
                            margin="none"
                            type="date"
                            InputLabelProps={{shrink: true}}
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
)(CreateReminder)