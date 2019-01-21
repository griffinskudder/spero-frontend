import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {GET_ACCOUNTS, GET_ALERTS, GET_CUSTOMERS, GET_TODOS, GET_USERS, UPDATE_CUSTOMER} from "../actions";
import NavLink from "react-router-dom/NavLink";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table/Table";
import NotEmptyTextField from "../validatedFields/notEmptyTextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem";


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

class ViewCustomer extends React.Component {
    state = {
        customerForm: {
            name: '',
            notes: '',
            users: [],
        },
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
        dispatch(testAPICall(`/api/v1/accounts/customer/${this.customerId}/`,
            UPDATE_CUSTOMER,
            payload,
            null,
            'PATCH',
            null,
            "Customer Updated"))
    };
    customerId = this.props.id;

    componentWillReceiveProps(nextProps, nextContext) {
        const nextCustomer = nextProps.customers[this.customerId];
        if (nextCustomer !== undefined) {
            this.setState({
                customerForm: {
                    name: nextCustomer.name,
                    notes: nextCustomer.notes,
                    users: nextCustomer.users,
                }
            })
        }
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(`/api/v1/accounts/account/`, GET_ACCOUNTS));
        dispatch(testAPICall(`/api/v1/auth/user/`, GET_USERS));
        dispatch(testAPICall(`/api/v1/accounts/customer/`, GET_CUSTOMERS));
        dispatch(testAPICall(`/api/v1/accounts/todo/`, GET_TODOS));
        dispatch(testAPICall(`/api/v1/accounts/alert/`, GET_ALERTS))
    }

    render() {
        const {alerts, toDos, accounts, users, classes} = this.props;

        let relevantAccounts = [];
        Object.keys(accounts).forEach(key => {
            let account = accounts[key];
            if (String(account.customer) === String(this.customerId)) {
                relevantAccounts.push(account.id);
            }
        });

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                        <ExpansionPanel defaultExpanded={true}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant="h6">
                                    Customer Details
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
                                            <InputLabel htmlFor="type">Users</InputLabel>
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
                                                name="type"
                                                inputProps={{
                                                    id: 'users',
                                                }}
                                                className={classes.textField}
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
                    <Grid item xs={12}>
                        <ExpansionPanel style={{maxWidth: '100%', overflowX: 'auto'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant="h6">
                                    Customer Accounts
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Name
                                            </TableCell>
                                            <TableCell>
                                                Assignee
                                            </TableCell>
                                            <TableCell>
                                                Active Alerts
                                            </TableCell>
                                            <TableCell>
                                                Active To Dos
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {relevantAccounts.map(key => {
                                            const assignedUsers = accounts[key].assigned_users;
                                            let assigneeNames = assignedUsers.map(assignee => {
                                                if (Object.keys(users).length) {
                                                    return `${users[assignee].first_name} ${users[assignee].last_name}`;
                                                } else {
                                                    return ""
                                                }
                                            });

                                            let assigneeNamesString = assigneeNames.join(", ");

                                            let alertCount = 0;
                                            Object.keys(alerts).forEach((value) => {
                                                if (String(alerts[value].account) === String(key)) {
                                                    alertCount++;
                                                }
                                            });
                                            let toDoCount = 0;
                                            Object.keys(toDos).forEach((value) => {
                                                if (String(toDos[value].account) === String(key)) {
                                                    toDoCount++;
                                                }
                                            });
                                            return (
                                                <TableRow key={key}>
                                                    <TableCell>
                                                        <Button style={{
                                                            textTransform: 'inherit',
                                                            font: 'inherit',
                                                            textAlign: 'left',
                                                            paddingLeft: 0,
                                                        }}
                                                                component={NavLink}
                                                                to={`/accounts/${key}`}>
                                                            {accounts[key].name}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {assigneeNamesString}
                                                    </TableCell>
                                                    <TableCell>
                                                        {alertCount}
                                                    </TableCell>
                                                    <TableCell>
                                                        {toDoCount}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                </Grid>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        users: state.authentication.users,
        customers: state.accounts.customers,
        alerts: state.accounts.alerts,
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
)(ViewCustomer)