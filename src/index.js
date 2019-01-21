import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import './index.css';
import {LOGOUT_SUCCESS} from "./actions";
import {accounts, auth, authentication, snackBar,} from "./reducers";
import {loadState, saveState} from "./localStorage";
import {throttle} from "lodash";
import {Provider} from "react-redux";
import {createBrowserHistory} from 'history';
import {ConnectedRouter, connectRouter, routerMiddleware} from 'connected-react-router';
import thunk from "redux-thunk";
import theme from "./theme";
import Typography from "@material-ui/core/Typography";
import ButtonAppBar from "./mainComponents/headerbar";
import {Route} from "react-router-dom";
import SignIn from "./auth/login";
import Dashboard from "./mainComponents/dashboard";
import Accounts from "./accounts/accounts";
import ViewAccount from "./accounts/viewAccount";
import Customers from "./accounts/customers";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {Redirect} from "react-router";
import CssBaseline from '@material-ui/core/CssBaseline';
import CreateReminder from "./reminders/createReminder";
import AddAccount from "./accounts/addAccount";
import AddCustomer from "./accounts/addCustomer";
import ViewCustomer from "./accounts/viewCustomer";
import Users from "./auth/users";
import UserProfile from "./auth/userProfile";


const history = createBrowserHistory();

const appReducer = combineReducers({
    auth,
    authentication,
    accounts,
    router: connectRouter(history),
    snackBar,
});


const reducers = (state, action) => {
    let updatedState = state;
    // reset state on logout
    if (action.type === LOGOUT_SUCCESS) {
        updatedState = undefined;
    }
    return appReducer(updatedState, action)
};

const persistedState = loadState();

const store = createStore(
    reducers,
    persistedState,
    compose(
        applyMiddleware(thunk,
            routerMiddleware(history))
    ),
);

// persist these reducers to local storage
store.subscribe(throttle(() => {
    saveState({
        auth: store.getState().auth,
    });
}, 1000));

export default store;

function PrivateRoute({component: Component, ...rest}) {
    const auth = store.getState().auth;
    return (<Route
            {...rest}
            render={props => (
                auth.isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{
                        pathname: '/login',
                        state: {from: props.location},
                    }}
                    />
                )
            )}
        />
    );
}

function AdminRoute({component: Component, ...rest}) {
    const auth = store.getState().auth;
    return (<Route
            {...rest}
            render={props => (
                auth.isSuperUser ? (
                    <Component {...props} />
                ) : (
                    <div>
                        <Typography variant="h1">
                            You don't have access.
                        </Typography>
                    </div>
                )
            )}
        />
    );
}

const dashboard = (props) => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <Dashboard/>
            </div>
        </ButtonAppBar>
    )
};

const accountsView = (props) => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <Accounts/>
            </div>
        </ButtonAppBar>
    )
};

const viewSingleAccount = ({props, match}) => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <ViewAccount id={match.params.id}/>
            </div>
        </ButtonAppBar>
    )
};

const createAccountAlert = ({props, match}) => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <CreateReminder id={match.params.id}/>
            </div>
        </ButtonAppBar>
    )
};

const addAccount = props => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <AddAccount/>
            </div>
        </ButtonAppBar>
    )
};

const customersView = props => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <Customers/>
            </div>
        </ButtonAppBar>
    )
};

const viewSingleCustomer = ({props, match}) => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <ViewCustomer id={match.params.id}/>
            </div>
        </ButtonAppBar>
    )
};

const addCustomer = props => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <AddCustomer/>
            </div>
        </ButtonAppBar>
    )
};

const usersView = props => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <Users/>
            </div>
        </ButtonAppBar>
    )
};

const userProfile = props => {
    return (
        <ButtonAppBar {...props}>
            <div>
                <UserProfile/>
            </div>
        </ButtonAppBar>
    )
};

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <div>
                    <Route path="/login" component={SignIn}/>
                    <PrivateRoute exact path="/" component={dashboard}/>
                    <PrivateRoute exact path="/accounts" component={accountsView}/>
                    <PrivateRoute exact path="/accounts/:id" component={viewSingleAccount}/>
                    <PrivateRoute exact path="/accounts/:id/reminder" component={createAccountAlert}/>
                    <PrivateRoute exact path="/addaccount" component={addAccount}/>
                    <PrivateRoute exact path="/profile" component={userProfile}/>
                    <AdminRoute exact path="/customers" component={customersView}/>
                    <AdminRoute exact path="/customers/:id" component={viewSingleCustomer}/>
                    <AdminRoute exact path="/addcustomer" component={addCustomer}/>
                    <AdminRoute exact path="/users" component={usersView}/>
                </div>
            </MuiThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'));
