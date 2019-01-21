import React from 'react';
import PropTypes from 'prop-types';
import {push} from 'react-router-redux';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NavLink from 'react-router-dom/NavLink';
import connect from "react-redux/es/connect/connect";
import {apiCall, testAPICall} from "../reducers";
import {GET_USERS, logoutUser, SNACKBAR_CLOSE} from "../actions";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import SwipableDrawer from "@material-ui/core/SwipeableDrawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List/List";

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '100vh', // make container fit screen size to menu always stays on screen
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        position: 'absolute',
        flexGrow: 1,
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    content: {
        flexGrow: 1,
        marginTop: 8 * theme.spacing.unit,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        overflowY: 'scroll',
    },
    flex: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: 'auto',
    },
    authIcon: {
        margin: theme.spacing.unit,
    },
    avatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: '#ec4b00',
    },
});

function AuthButton(props) {
    const {auth, classes, dispatch, authentication} = props;
    if (auth.isAuthenticated) {
        return (
            <AuthMenu auth={auth} authentication={authentication} classes={classes} dispatch={dispatch}/>
        )
    }
    else {
        return (<Button component={NavLink} to="/login" color="inherit">Login</Button>)
    }
}

class ButtonAppBar extends React.Component {
    state = {
        mobileOpen: false,
    };

    componentWillMount = () => {
        const {dispatch} = this.props;
        dispatch(testAPICall(
            `/api/v1/auth/user/`,
            GET_USERS))
    };

    handleDrawerToggle = (open) => {
        if (open === undefined) {
            this.setState(state => ({mobileOpen: !state.mobileOpen}));
        } else {
            this.setState({mobileOpen: open});
        }

    };

    render() {
        const {classes, auth, authentication, snackBar, dispatch, theme} = this.props;

        return (
            <div className={classes.root}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.navIconHide}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h5" color="inherit" noWrap>
                            Spero Digital Management Portal
                        </Typography>
                        <AuthButton auth={auth} authentication={authentication} classes={classes} dispatch={dispatch}/>
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
                    <SwipableDrawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={this.state.mobileOpen}
                        onOpen={() => this.handleDrawerToggle(true)}
                        onClose={() => this.handleDrawerToggle(false)}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <NavMenu auth={auth}/>
                    </SwipableDrawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <NavMenu auth={auth}/>
                    </Drawer>
                </Hidden>
                <div className={classes.content}>
                    {this.props.children}
                </div>
                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    open={snackBar.open}
                    autoHideDuration={2000}
                    onClose={() => {
                        dispatch({type: SNACKBAR_CLOSE});
                    }}
                    ContentProps={{'aria-describedby': 'message-id'}}
                    message={snackBar.message}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={() => {
                                dispatch({type: SNACKBAR_CLOSE});
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

class AuthMenu extends React.Component {
    state = {
        anchorE1: null,
    };

    handleClick = event => {
        this.setState({anchorE1: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorE1: null});
    };

    handleLogout = () => {
        this.props.dispatch(apiCall('/api/auth/logout/', 'LOGOUT', null, null, 'POST'));
        this.handleClose();
        logoutUser();
        this.props.dispatch(push('/login'))
    };

    render() {

        const {anchorE1} = this.state;
        const {auth, authentication, classes} = this.props;
        const user = authentication.users[auth.userId];
        let name;
        if (user !== undefined) {
            name = `${user.first_name} ${user.last_name}`;
        }
        else {
            name = "";
        }
        return (
            <div
                className={classes.menuButton}
            >
                <Button
                    color="inherit"
                    component="div"
                    aria-label="Menu"
                    aria-owns={anchorE1 ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    style={{textTransform: 'inherit',}}
                >
                    <PersonIcon className={classes.authIcon}/>
                    {name}
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorE1}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorE1)}
                    onClose={this.handleClose}
                >
                    <MenuItem component={NavLink} to="/profile">Profile</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Log Out</MenuItem>
                </Menu>
            </div>
        );
    }
}


class NavMenu extends React.Component {

    render() {
        const {auth} = this.props;
        let customerItem = "";
        let userItem = "";
        if (auth !== undefined) {
            if (auth.isSuperUser) {
                customerItem = (
                    <List>
                        <MenuItem component={NavLink} to="/customers">Customers</MenuItem>
                    </List>
                );
                userItem = (
                    <List>
                        <MenuItem component={NavLink} to="/users">Users</MenuItem>
                    </List>
                );
            }
        }


        return (
            <div>
                <List>
                    <MenuItem component={NavLink} to="/">Dashboard</MenuItem>
                </List>
                <Divider/>
                <List>
                    <MenuItem component={NavLink} to="/accounts">Accounts</MenuItem>
                </List>
                {customerItem}
                {userItem}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        snackBar: state.snackBar,
        authentication: state.authentication,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(ButtonAppBar));