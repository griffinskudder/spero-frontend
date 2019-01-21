import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {UPDATE_ACCOUNT} from "../actions";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import NotEmptyTextField from '../validatedFields/notEmptyTextField';
import NotEmptyPositiveNumberField from '../validatedFields/notEmptyPositiveNumberField';
import NotEmptyURLTextField from '../validatedFields/notEmptyURLTextField';


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

class AddAccount extends React.Component {
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
    };

    handleClose = () => {
        this.props.onClose();
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
            assigned_users: this.state.accountForm.assigned_users,
        };
        dispatch(testAPICall(`/api/v1/accounts/account/`,
            UPDATE_ACCOUNT,
            payload,
            () => {
                this.handleClose();
                this.setState({
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
                })
            },
            'POST',
            null,
            "Account Created"))
    };

    render() {
        const {customers, customersOrder, users, classes, open} = this.props;

        return (
            <Dialog fullWidth={true} onClose={this.handleClose} aria-labelledby="dialog-title" open={open}>
                <DialogTitle id="dialog-title">Create Account</DialogTitle>
                <DialogContent>
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
                                className={classes.selectEmpty}
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
                        <NotEmptyPositiveNumberField
                            required
                            type="number"
                            id="search_monthly_budget"
                            label="Search Monthly Budget"
                            className={classes.textField}
                            value={this.state.accountForm.search_monthly_budget}
                            onChange={this.handleChange('search_monthly_budget')}
                            margin="none"
                        />
                        <TextField
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
                                renderValue={selected => selected.join(', ')}
                                name="assigned_users"
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        color="secondary"
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
        auth: state.auth,
        accounts: state.accounts.accounts,
        users: state.authentication.users,
        customers: state.accounts.customers,
        customersOrder: state.accounts.customersOrder,
        categories: state.accounts.categories,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

const MobileDialogue = withMobileDialog()(AddAccount);

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(MobileDialogue)