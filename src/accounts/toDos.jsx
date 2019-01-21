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
import Button from "@material-ui/core/Button/Button";
import CreateLogEntry from "./createLogEntry";
import NavLink from "react-router-dom/NavLink";


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
    }
});

class ToDos extends React.Component {
    state = {
        dialogOpen: false,
        currentToDoId: undefined,
    };

    handleClickOpen = (toDoId) => {
        this.setState({
            currentToDoId: toDoId,
        });
        this.setState({
            dialogOpen: true,
        });
    };

    handleClose = () => {
        this.setState({
            dialogOpen: false,
        });
    };

    render() {
        const {accounts, toDos, toDosOrder, categories, accountId, toDoId} = this.props;

        let relevantToDos = [];
        if (accountId !== undefined) {
            toDosOrder.forEach(key => {
                let toDo = toDos[key];
                if (String(toDo.account) === String(accountId)) {
                    relevantToDos.push(toDo);
                }
            });
        }
        else if (toDoId !== undefined) {
            relevantToDos.push(toDos[toDoId]);
        }
        else {
            relevantToDos = toDosOrder.map(key => {
                return toDos[key]
            })
        }

        if (relevantToDos.length === 0) {
            return (
                <ExpansionPanel defaultExpanded={!accountId || toDoId}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">
                            {toDoId === undefined ? "To Dos" : "To Do"}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        No to dos :)
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }

        return (
            <div>
                <ExpansionPanel defaultExpanded={!accountId || toDoId}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">
                            {toDoId === undefined ? "To Dos: " + relevantToDos.length : "To Do"}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{maxWidth: '100%', overflowX: 'auto'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Title
                                    </TableCell>
                                    <TableCell>
                                        Category
                                    </TableCell>
                                    {(accountId === undefined) &&
                                    (<TableCell>
                                        Account
                                    </TableCell>)}
                                    {(toDoId === undefined) &&
                                    (<TableCell>
                                        Controls
                                    </TableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {relevantToDos.map(toDo => {
                                    return (
                                        <TableRow key={toDo.id}>
                                            <TableCell>
                                                {toDo.title}
                                            </TableCell>
                                            <TableCell>
                                                {(categories[toDo.category] !== undefined) ? categories[toDo.category].name : ""}
                                            </TableCell>
                                            {(accountId === undefined) &&
                                            (<TableCell>
                                                {(accounts[toDo.account] !== undefined) ?
                                                    <Button style={{
                                                        textTransform: 'inherit',
                                                        font: 'inherit',
                                                        textAlign: 'left',
                                                        paddingLeft: 0,
                                                    }}
                                                            component={NavLink}
                                                            to={`/accounts/${toDo.account}`}>
                                                        {accounts[toDo.account].name}
                                                    </Button>
                                                    : ""}
                                            </TableCell>)}
                                            {(toDoId === undefined) &&
                                            (<TableCell>
                                                    <Button variant='contained' color="primary"
                                                            onClick={() => this.handleClickOpen(toDo.id)}>
                                                        Clear
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </ExpansionPanelDetails>
                    <CreateLogEntry
                        open={this.state.dialogOpen}
                        onClose={() => this.handleClose()}
                        accountId={this.accountId}
                        reminderId={this.state.currentToDoId}
                    />
                </ExpansionPanel>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        alerts: state.accounts.alerts,
        alertsOrder: state.accounts.alertsOrder,
        toDos: state.accounts.toDos,
        toDosOrder: state.accounts.toDosOrder,
        categories: state.accounts.categories,
        accounts: state.accounts.accounts,
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
)(ToDos)