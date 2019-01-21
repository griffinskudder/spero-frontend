import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {CREATE_CUSTOMER} from "../actions";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import NotEmptyTextField from "../validatedFields/notEmptyTextField";
import TextField from "@material-ui/core/TextField/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";


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

class AddCustomer extends React.Component {
    state = {
        customerForm: {
            name: '',
            notes: '',
            users: [],
        },
    };

    handleClose = () => {
        this.props.onClose();
    };

    handleChange = name => event => {
        const customerForm = Object.assign({}, this.state.customerForm, {[name]: event.target.value,});
        this.setState({
            customerForm: customerForm,
        });
    };

    handleSubmit = () => {
        const {dispatch} = this.props;
        let payload = {
            name: this.state.customerForm.name,
            notes: this.state.customerForm.notes,
            users: this.state.customerForm.users,
        };
        dispatch(testAPICall(`/api/v1/accounts/customer/`,
            CREATE_CUSTOMER,
            payload,
            () => {
                this.handleClose();
                this.setState({
                    customerForm: {
                        name: '',
                        notes: '',
                        users: [],
                    },
                });
            },
            'POST',
            null,
            "Customer Created"))
    };

    render() {
        const {classes, users, open} = this.props;

        return (
            <Dialog fullWidth={true} onClose={this.handleClose} aria-labelledby="dialog-title" open={open}>
                <DialogTitle id="dialog-title">Create Customer</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <NotEmptyTextField
                            required
                            id="name"
                            label="Name"
                            className={classes.textField}
                            value={this.state.customerForm.name}
                            onChange={this.handleChange('name')}
                            margin="none"
                        />
                        <TextField
                            multiline
                            rows={4}
                            id="notes"
                            label="Notes"
                            className={classes.textField}
                            value={this.state.customerForm.notes}
                            onChange={this.handleChange('notes')}
                            margin="none"
                        />
                        <FormControl fullWidth>
                            <InputLabel htmlFor="users">Users</InputLabel>
                            <Select
                                multiple
                                value={this.state.customerForm.users}
                                onChange={this.handleChange('users')}
                                renderValue={selected => {
                                    let names = selected.map((userId) => {
                                        return `${users[userId].first_name} ${users[userId].last_name}`
                                    });
                                    return names.join(', ')
                                }}
                                name="users"
                                inputProps={{
                                    id: 'users',
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

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

const mapStateToProps = state => {
    return {
        users: state.authentication.users,
    };
};

const MobileDialogue = withMobileDialog()(AddCustomer);

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(MobileDialogue)