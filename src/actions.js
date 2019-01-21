import {push} from 'react-router-redux';


const __API__ = 'https://app.sperodigital.co'; // TODO: Change this

export const SNACKBAR_OPEN = 'SNACKBAR_OPEN';
export const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';


export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

function requestLogin(credentials) {
    return {
        type: LOGIN_REQUEST,
        credentials: credentials,
    };
}

export function recieveLogin(data) {
    return {
        type: LOGIN_SUCCESS,
        data,
    };
}

export function loginError(errors) {
    return {
        type: LOGIN_FAILURE,
        errors,
    };
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
    };
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
    };
}

export function logoutUser() {
    return (dispatch) => {
        dispatch(requestLogout());
        localStorage.removeItem('state');
        dispatch(receiveLogout());
    };
}


export function setUser(user, redirectUrl) {
    return (dispatch) => {
        dispatch(recieveLogin(user));
        dispatch(push(redirectUrl));
    };
}

export function loginUser(credentials, redirect) {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "username": credentials.username,
            "password": credentials.password,
        }),
    };
    return (dispatch) => {
        dispatch(requestLogin(credentials));
        return fetch(`${__API__}/api/auth/login/`, config)
            .then(response => response.json().then(user => ({user, response}))).then(({user, response}) => {
                if (!response.ok) {
                    // If there was a problem, we want to

                    // dispatch the error condition
                    let {error} = user;
                    if (Object.prototype.hasOwnProperty.call(user, 'message')) {
                        error = {__all__: user.message};
                    }

                    dispatch(loginError(error));
                    return Promise.reject(user);
                }
                dispatch(setUser(user, redirect));
                return true;
                // eslint-disable-next-line no-console
            }).catch(err => console.log('Error: ', err));
    };
}

export const GET_ALERTS = "GET_ALERTS";

export const CREATE_ALERT = "CREATE_ALERT";

export const GET_UPCOMING_ALERTS = "GET_UPCOMING_ALERTS";

export const CREATE_UPCOMING_ALERT = "CREATE_UPCOMING_ALERT";

export const GET_TODOS = "GET_TODOS";

export const CREATE_TODO = "CREATE_TODO";

export const GET_CATEGORIES = "GET_CATEGORIES";

export const GET_CUSTOMERS = "GET_CUSTOMERS";

export const UPDATE_CUSTOMER = "UPDATE_CUSTOMER";

export const CREATE_CUSTOMER = "CREATE_CUSTOMER";

export const GET_ACCOUNTS = "GET_ACCOUNTS";

export const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";

export const GET_USERS = "GET_USERS";

export const GET_CURRENT_USER = "GET_CURRENT_USER";

export const UPDATE_CURRENT_USER = "UPDATE_CURRENT_USER";

export const GET_LOG_ENTRIES = "GET_LOG_ENTRIES";

export const CREATE_LOG_ENTRY = "CREATE_LOG_ENTRY";

export const UPDATE_LOG_ENTRY = "UPDATE_LOG_ENTRY";

export const GET_REMINDERS = "GET_REMINDERS";

export const GET_RECURRING_REMINDERS = "GET_RECURRING_REMINDERS";

export const CREATE_RECURRING_REMINDER = "CREATE_RECURRING_REMINDER";

export const UPDATE_RECURRING_REMINDER = "UPDATE_RECURRING_REMINDER";

export const DELETE_RECURRING_REMINDER = "DELETE_RECURRING_REMINDER";
