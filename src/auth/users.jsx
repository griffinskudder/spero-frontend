import React from 'react';
import Table from '@material-ui/core/Table/Table';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Paper from '@material-ui/core/Paper/Paper';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux";
import {testAPICall} from "../reducers";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import {GET_USERS} from "../actions";


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
    button: {
        margin: theme.spacing.unit / 2,
    },
    spacingDiv: {
        height: 1 * theme.spacing.unit,
    }
});

class Users extends React.Component {
    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(testAPICall(`/api/v1/auth/user/`, GET_USERS));
    }

    render() {
        const {users, usersOrder, classes} = this.props;
        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h4">
                                Users
                            </Typography>
                        </Paper>
                        <div className={classes.spacingDiv}/>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Number of Accounts
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usersOrder.map(key => {
                                    let user = users[key];
                                    let userName = `${user.first_name} ${user.last_name}`;
                                    let accountCount = user.account_set.length;
                                    return (
                                        <TableRow key={key}>
                                            <TableCell>
                                                {userName}
                                            </TableCell>
                                            <TableCell>
                                                {accountCount}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        users: state.authentication.users,
        usersOrder: state.authentication.usersOrder,
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
)(Users)