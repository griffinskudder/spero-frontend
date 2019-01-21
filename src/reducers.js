import {
    CREATE_ALERT,
    CREATE_CUSTOMER,
    CREATE_LOG_ENTRY,
    CREATE_RECURRING_REMINDER,
    CREATE_TODO,
    CREATE_UPCOMING_ALERT,
    DELETE_RECURRING_REMINDER,
    GET_ACCOUNTS,
    GET_ALERTS,
    GET_CATEGORIES,
    GET_CURRENT_USER,
    GET_CUSTOMERS,
    GET_LOG_ENTRIES,
    GET_RECURRING_REMINDERS,
    GET_REMINDERS,
    GET_TODOS,
    GET_UPCOMING_ALERTS,
    GET_USERS,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    loginError,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    SNACKBAR_CLOSE,
    SNACKBAR_OPEN,
    UPDATE_ACCOUNT,
    UPDATE_CURRENT_USER,
    UPDATE_CUSTOMER,
    UPDATE_LOG_ENTRY,
    UPDATE_RECURRING_REMINDER,
} from "./actions";
import {push} from 'react-router-redux';
import store from './index';

const __API__ = "https://app.sperodigital.co";

function copyAndMerge(state, newState) {
    return Object.assign({}, state, newState)
}

export function fileUploadAPICall(
    endpoint, type, payload, callBack, method, filename,
) {
    const state = store.getState();
    const {token} = state.auth;
    let form = new FormData();
    form.append('file', payload);
    let config = {
        method, headers: {
            'Authorization': `Token ${token}`,
            'Accept': 'application/json',
            'Content-Disposition': `attachment; filename=${filename}`,
        },
        body: form,
    };
    console.log(callBack);
    return (dispatch) => {
        return fetch(`${__API__}${endpoint}`, config)
            .then((response) => {
                    console.log(response);
                    if (!response.ok) {
                        if (response.status === 401) {
                            dispatch(loginError(response.body));
                            dispatch(push('/login'));
                        }
                        else {
                            console.log("Failed")
                        }
                    }
                    else {
                        let test = Object.assign({type: type}, null);
                        console.log('Success');
                        dispatch(test);
                        if (callBack !== null) {
                            callBack(response.body);
                        }
                    }
                    return {response};
                },
                err => dispatch(Object.assign({type: "", err}, null)),
            );
    };
}

export function testAPICall(
    endpoint, type, payload = null, callBack = null, method = 'GET',
    action = {}, message = null, contentType = 'application/json',
) {
    let config;
    const state = store.getState();
    const {token} = state.auth;
    if (contentType == null) {
        config = {
            method, headers: {
                'Authorization': `Token ${token}`,
                'Accept': 'application/json',
            },
        };
    }
    else {
        config = {
            method, headers: {
                'Content-Type': contentType,
                'Authorization': `Token ${token}`,
                'Accept': 'application/json',
            },
        };
    }
    if (payload !== null) {
        config.body = JSON.stringify(payload);
    }
    return (dispatch) => {
        return fetch(`${__API__}${endpoint}`, config)
            .then(response => {
                if (response.status !== 204) {
                    return response.json().then(data => ({data, response}))
                }
                let data = [];
                return ({data, response})
            })
            .then(
                ({data, response}) => {
                    if (!response.ok) {
                        if (response.status === 401) {
                            dispatch(loginError(data));
                            dispatch(push('/login'));
                        }
                        else {
                            console.log("Failed")
                        }
                    }
                    else {
                        let test = Object.assign({type: type, data}, action);
                        dispatch(test);
                        if (callBack !== null) {
                            callBack(data);
                        }
                        if (message !== null) {
                            dispatch({type: SNACKBAR_OPEN, message});
                        }
                    }
                    return {data, response};
                },
                err => dispatch(Object.assign({type: "", err}, action)),
            );
    };
}

export function apiCall(
    endpoint, type, payload = null, callBack = null, method = 'GET',
    action = {}, message = null, contentType = 'application/json'
) {
    let config;
    const requestType = `${type}_REQUEST`;
    const successType = `${type}_SUCCESS`;
    const failureType = `${type}_FAILURE`;

    const state = store.getState();
    const {token} = state.auth;
    if (contentType == null) {
        config = {
            method, headers: {
                'Authorization': `Token ${token}`,
                'Accept': 'application/json',
            },
        };
    }
    else {
        config = {
            method, headers: {
                'Content-Type': contentType,
                'Authorization': `Token ${token}`,
                'Accept': 'application/json',
            },
        };
    }

    if (payload !== null) {
        config.body = JSON.stringify(payload);
    }
    return (dispatch) => {
        dispatch({type: requestType});
        return fetch(`${__API__}${endpoint}`, config)
            .then(response => response.json().then(data => ({data, response})))
            .then(
                ({data, response}) => {
                    if (!response.ok) {
                        if (response.status === 401) {
                            dispatch(loginError(data));
                            dispatch(push('/login'));
                        }
                        else {
                            dispatch(Object.assign({type: failureType, data}, action));
                        }
                    }
                    else {
                        let test = Object.assign({type: successType, data}, action);
                        dispatch(test);
                        if (callBack !== null) {
                            callBack(data);
                        }
                        if (message !== null) {
                            dispatch({type: SNACKBAR_OPEN, message});
                        }
                    }
                    return {data, response};
                },
                err => dispatch(Object.assign({type: failureType, err}, action)),
            );
    };
}


const authInitialState = {
    userId: undefined,
    isAuthenticated: false,
    isSuperUser: false,
    token: '',
};

export function auth(state = authInitialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: true,
                token: action.data.token,
                userId: action.data.user.id,
                isSuperUser: action.data.user.is_staff,
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        case LOGOUT_REQUEST:
            return state;
        case LOGOUT_SUCCESS:
            console.log("LOGOUT_SUCCESS");
            // this doesn't matter as the entire state should be deleted on log out
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        default:
            return state
    }
}

const snackBarInitialState = {
    open: false,
    message: '',
};

export function snackBar(state = snackBarInitialState, action) {
    switch (action.type) {
        case SNACKBAR_OPEN:
            return Object.assign({}, state, {
                open: true,
                message: action.message,
            });
        case SNACKBAR_CLOSE:
            return Object.assign({}, state, {
                open: false,
                message: '',
            });
        default:
            return state;
    }
}

export const authenticationInitialState = {
    users: {},
    usersOrder: [],
    currentUser: {},
};

export function authentication(state = authenticationInitialState, action) {
    switch (action.type) {
        case GET_USERS:
            let users = {};
            let usersOrder = [];
            action.data.forEach((value) => {
                users[value.id] = value;
                usersOrder.push(value.id);
            });
            return copyAndMerge(state, {
                users: users,
                usersOrder: usersOrder,
            });
        case GET_CURRENT_USER:
            let currentUser = action.data[0];
            return copyAndMerge(state, {
                currentUser: currentUser,
            });
        case UPDATE_CURRENT_USER:
            return copyAndMerge(state, {
                currentUser: action.data,
            });
        default:
            return state
    }
}

export const accountsInitialState = {
    accounts: {},
    alerts: {},
    alertsOrder: [],
    upcomingAlerts: {},
    upcomingAlertsOrder: [],
    categories: {},
    customers: {},
    customersOrder: [],
    logEntries: {},
    logEntriesOrder: [],
    reminders: {},
    recurringReminders: {},
    recurringRemindersOrder: [],
    toDos: {},
    toDosOrder: [],
};

export function accounts(state = accountsInitialState, action) {
    let newState;
    switch (action.type) {
        case GET_ALERTS:
            let alerts = {};
            let alertsOrder = action.data.map(item => item.id);
            action.data.forEach((value) => {
                alerts[value.id] = value;
            });
            return copyAndMerge(state, {
                alerts: alerts,
                alertsOrder: alertsOrder,
            });
        case CREATE_ALERT:
            newState = copyAndMerge(state, {});
            newState.alerts[action.data.id] = action.data;
            newState.alertsOrder.push(action.data.id);
            return newState;
        case GET_UPCOMING_ALERTS:
            let upcomingAlerts = {};
            let upcomingAlertsOrder = action.data.map(item => item.id);
            action.data.forEach((value) => {
                upcomingAlerts[value.id] = value;
            });
            return copyAndMerge(state, {
                upcomingAlerts: upcomingAlerts,
                upcomingAlertsOrder: upcomingAlertsOrder,
            });
        case CREATE_UPCOMING_ALERT:
            newState = copyAndMerge(state, {});
            newState.upcomingAlerts[action.data.id] = action.data;
            newState.upcomingAlertsOrder.push(action.data.id);
            return newState;
        case GET_TODOS:
            let toDos = {};
            let toDosOrder = action.data.map(item => item.id);
            action.data.forEach((value) => {
                toDos[value.id] = value;
            });
            return copyAndMerge(state, {
                toDos: toDos,
                toDosOrder: toDosOrder,
            });
        case CREATE_TODO:
            newState = copyAndMerge(state, {});
            newState.toDos[action.data.id] = action.data;
            newState.toDosOrder.push(action.data.id);
            return newState;
        case GET_CATEGORIES:
            let categories = {};
            action.data.forEach((value) => {
                categories[value.id] = value;
            });
            return copyAndMerge(state, {
                categories: categories,
            });
        case GET_CUSTOMERS:
            let customers = {};
            let customersOrder = [];
            action.data.forEach((value) => {
                customers[value.id] = value;
                customersOrder.push(value.id);
            });
            return copyAndMerge(state, {
                customers: customers,
                customersOrder: customersOrder,
            });
        case UPDATE_CUSTOMER:
            newState = copyAndMerge(state, {});
            newState.customers[action.data.id] = action.data;
            return newState;
        case CREATE_CUSTOMER:
            newState = copyAndMerge(state, {});
            newState.customers[action.data.id] = action.data;
            newState.customersOrder.push(action.data.id);
            return newState;
        case GET_ACCOUNTS:
            let accounts = {};
            action.data.forEach((value) => {
                accounts[value.id] = value;
            });
            return copyAndMerge(state, {
                accounts: accounts,
            });
        case UPDATE_ACCOUNT:
            newState = copyAndMerge(state, {});
            newState.accounts[action.data.id] = action.data;
            return newState;
        case GET_LOG_ENTRIES:
            let logEntries = {};
            let logEntriesOrder = action.data.map(item => item.id);
            action.data.forEach((value) => {
                logEntries[value.id] = value;
            });
            return copyAndMerge(state, {
                logEntries: logEntries,
                logEntriesOrder: logEntriesOrder,
            });
        case CREATE_LOG_ENTRY:
            newState = copyAndMerge(state, {});
            newState.logEntries[action.data.id] = action.data;
            newState.logEntriesOrder.unshift(action.data.id);
            if (action.data.reminder && !action.data.draft) {
                for (let i = 0; i < newState.toDosOrder.length; i++) {
                    if (String(newState.toDosOrder[i]) === String(action.data.reminder)) {
                        newState.toDosOrder.splice(i, 1);
                    }
                }
                delete newState.toDos[action.data.reminder];
                for (let i = 0; i < newState.alertsOrder.length; i++) {
                    if (String(newState.alertsOrder[i]) === String(action.data.reminder)) {
                        newState.alertsOrder.splice(i, 1);
                    }
                }
                delete newState.alerts[action.data.reminder];
            }
            return newState;
        case UPDATE_LOG_ENTRY:
            newState = copyAndMerge(state, {});
            newState.logEntries[action.data.id] = action.data;
            if (!state.logEntries[action.data.id].draft && action.data.draft && action.data.reminder) {
                for (let i = 0; i < newState.toDosOrder.length; i++) {
                    if (String(newState.toDosOrder[i]) === String(action.data.reminder)) {
                        newState.toDosOrder.splice(i, 1);
                    }
                }
                delete newState.toDos[action.data.reminder];
                for (let i = 0; i < newState.alertsOrder.length; i++) {
                    if (String(newState.alertsOrder[i]) === String(action.data.reminder)) {
                        newState.alertsOrder.splice(i, 1);
                    }
                }
                delete newState.alerts[action.data.reminder];
            }
            return newState;
        case GET_REMINDERS:
            let reminders = {};
            action.data.forEach((value) => {
                reminders[value.id] = value;
            });
            return copyAndMerge(state, {
                reminders: reminders,
            });
        case GET_RECURRING_REMINDERS:
            let recurringReminders = {};
            let recurringRemindersOrder = [];
            action.data.forEach((value) => {
                recurringReminders[value.id] = value;
                recurringRemindersOrder.push(value.id);
            });
            return copyAndMerge(state, {
                recurringReminders: recurringReminders,
                recurringRemindersOrder: recurringRemindersOrder,
            });
        case CREATE_RECURRING_REMINDER:
            newState = copyAndMerge(state, {});
            newState.recurringReminders[action.data.id] = action.data;
            newState.recurringRemindersOrder.push(action.data.id);
            return newState;
        case UPDATE_RECURRING_REMINDER:
            newState = copyAndMerge(state, {});
            newState.recurringReminders[action.data.id] = action.data;
            return newState;
        case DELETE_RECURRING_REMINDER:
            return state;
        default:
            return state
    }
}
