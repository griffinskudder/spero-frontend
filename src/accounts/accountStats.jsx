import React from 'react';
import Table from '@material-ui/core/Table/Table';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {connect} from "react-redux";
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';


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
    },
});

class AccountStats extends React.Component {

    render() {
        const {accountName, accountId, logEntries, logEntriesOrder} = this.props;
        let lastDayOfLastMonth = new Date();
        lastDayOfLastMonth.setDate(0);
        let firstDayOfLastMonth = new Date();
        firstDayOfLastMonth.setDate(1);
        firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);
        let firstDayOfThisMonth = new Date();
        firstDayOfThisMonth.setDate(1);
        let last_month_spent = 0;
        let this_month_spent = 0;
        let all_time_spent = 0;
        if (logEntriesOrder.length > 0) {
            logEntriesOrder.forEach(key => {
                let logEntry = logEntries[key];
                let modifiedDate = new Date(logEntry.modified);
                if (modifiedDate <= lastDayOfLastMonth &&
                    modifiedDate >= firstDayOfLastMonth &&
                    !logEntry.draft && String(logEntry.account) === String(accountId)) {
                    let timeArr = logEntry.time_spent.split(":");
                    last_month_spent += Number(timeArr[0]) * 60 + Number(timeArr[1]) + Number(timeArr[2]) / 60;
                }
            });
            logEntriesOrder.forEach(key => {
                let logEntry = logEntries[key];
                let modifiedDate = new Date(logEntry.modified);
                if ((modifiedDate >= firstDayOfThisMonth) &&
                    (!logEntry.draft) &&
                    (String(logEntry.account) === String(accountId))) {
                    let timeArr = logEntry.time_spent.split(":");
                    const timeSpent = Number(timeArr[0]) * 60 + Number(timeArr[1]) + Number(timeArr[2]) / 60;
                    return this_month_spent += timeSpent;
                }
            });
            logEntriesOrder.forEach(key => {
                let logEntry = logEntries[key];
                if (String(logEntry.account) === String(accountId)) {
                    let timeArr = logEntry.time_spent.split(":");
                    const timeSpent = Number(timeArr[0]) * 60 + Number(timeArr[1]) + Number(timeArr[2]) / 60;
                    return all_time_spent += timeSpent;
                }
            });
        }


        return (
            <div>
                <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">
                            Account Stats - {accountName}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{maxWidth: '100%', overflowX: 'auto'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Time Spent Last Month
                                    </TableCell>
                                    <TableCell>
                                        Time Spent This Month
                                    </TableCell>
                                    <TableCell>
                                        All Time Spent
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        {(last_month_spent !== undefined) ? last_month_spent + " minutes" : "0 minutes"}
                                    </TableCell>
                                    <TableCell>
                                        {this_month_spent !== undefined ? this_month_spent + " minutes" : "0 minutes"}
                                    </TableCell>
                                    <TableCell>
                                        {all_time_spent !== undefined ? all_time_spent + " minutes" : "0 minutes"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        logEntries: state.accounts.logEntries,
        logEntriesOrder: state.accounts.logEntriesOrder,
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
)(AccountStats)