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
import {GET_CUSTOMERS} from "../actions";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import AddCustomer from './addCustomer';


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

class Customers extends React.Component {
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
        dispatch(testAPICall(`/api/v1/accounts/customer/`, GET_CUSTOMERS));
    }

    render() {
        const {customers, customersOrder, classes} = this.props;

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h4">
                                Customers
                            </Typography>
                        </Paper>
                        <div className={classes.spacingDiv}/>

                        <Paper style={{maxWidth: '100%', overflowX: 'auto'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Customer Name
                                        </TableCell>
                                        <TableCell>
                                            Number of Accounts
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customersOrder.map(key => {
                                        let customer = customers[key];
                                        let accountCount = customer.account_set.length;
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
                                                            to={`/customers/${key}`}>
                                                        {customer.name}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    {accountCount}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
                <Tooltip title="Add Customer" placement="left">
                    <Fab
                        onClick={this.handleClickOpen}
                        className={classes.fab}
                        color="secondary"
                    >
                        <AddIcon/>
                    </Fab>
                </Tooltip>
                <AddCustomer
                    open={this.state.dialogOpen}
                    onClose={this.handleClose}
                />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        customers: state.accounts.customers,
        customersOrder: state.accounts.customersOrder,
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
)(Customers)