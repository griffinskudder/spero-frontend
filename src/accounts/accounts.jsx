import React from 'react';
import Table from '@material-ui/core/Table/Table';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper/Paper';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography';
import NavLink from 'react-router-dom/NavLink';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {GET_ACCOUNTS, GET_ALERTS, GET_CUSTOMERS, GET_TODOS, GET_USERS} from "../actions";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import AddAccount from './addAccount';


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
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
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

class Accounts extends React.Component {
    state = {
        dialogOpen: false,
    };

    handleClickOpen = () => {
        this.setState({
            dialogOpen: true,
        });
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(`/api/v1/accounts/account/`, GET_ACCOUNTS));
        dispatch(testAPICall(`/api/v1/auth/user/`, GET_USERS));
        dispatch(testAPICall(`/api/v1/accounts/customer/`, GET_CUSTOMERS));
        dispatch(testAPICall(`/api/v1/accounts/alert/`, GET_ALERTS));
        dispatch(testAPICall(`/api/v1/accounts/todo/`, GET_TODOS));
    }

    render() {
        const {accounts, alerts, toDos, customers, users, isSuperUser, classes} = this.props;

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h4">
                                Accounts
                            </Typography>
                        </Paper>
                        <div className={classes.spacingDiv}/>

                        <Paper style={{maxWidth: '100%', overflowX: 'auto'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Name
                                        </TableCell>
                                        <TableCell>
                                            Customer
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
                                    {Object.keys(accounts).map(key => {
                                        const assignedUsers = accounts[key].assigned_users;
                                        let assigneeNames;
                                        if (Object.keys(users).length === 0) {
                                            assigneeNames = [];
                                        } else {
                                            assigneeNames = assignedUsers.map(assignee => {
                                                return `${users[assignee].first_name} ${users[assignee].last_name}`;
                                            });
                                        }

                                        let assigneeNamesString = assigneeNames.join(", ");

                                        const customer = customers[accounts[key].customer];
                                        let customerName;
                                        let customerId;
                                        if (customer === undefined) {
                                            customerName = "";
                                        } else {
                                            customerName = customer.name;
                                            customerId = customer.id;
                                        }
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
                                                    {isSuperUser && customerId !== undefined && (
                                                        <Button style={{
                                                            textTransform: 'inherit',
                                                            font: 'inherit',
                                                            textAlign: 'left',
                                                            paddingLeft: 0,
                                                        }}
                                                                component={NavLink}
                                                                to={`/customers/${customerId}`}>
                                                            {customerName}
                                                        </Button>
                                                    )}
                                                    {!isSuperUser && (
                                                        customerName
                                                    )}
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
                                        )})}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
                <Tooltip title="Add Account" placement="left">
                    <Fab
                        onClick={this.handleClickOpen}
                        className={classes.fab}
                        color="secondary"
                    >
                        <AddIcon/>
                    </Fab>
                </Tooltip>
                <AddAccount
                    open={this.state.dialogOpen}
                    onClose={this.handleClose}
                />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        isSuperUser: state.auth.isSuperUser,
        accounts: state.accounts.accounts,
        users: state.authentication.users,
        customers: state.accounts.customers,
        alerts: state.accounts.alerts,
        toDos: state.accounts.toDos,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(Accounts)