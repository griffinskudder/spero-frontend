import React, {Component} from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import './App.css';

import {Switch} from "react-router";

import ButtonAppBar from "./mainComponents/headerbar";
import SignIn from "./auth/login";
import theme from "./theme";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <div>
            <Switch>
              <Route path="/" component={ButtonAppBar}/>
              <Route path="/login" component={SignIn}/>
            </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
