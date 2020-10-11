import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import * as serviceWorker from "./serviceWorker";

import AdminLayout from "./layouts/Admin.jsx";
import Login from "./components/security/Login.jsx";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.1.0";
import "assets/css/main.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AuthenticatedComponent from "./components/security/AuthenticatedCopmponent";
import { getJwt } from "helpers/jwt";
import axios from "axios";
import "./config.js";

const hist = createBrowserHistory();

axios.interceptors.request.use(
  (config) => {
    const token = getJwt();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} />
      <AuthenticatedComponent>
        {/* <Redirect to="/admin" /> */}
        <Route path="/" render={(props) => <AdminLayout {...props} />} />
      </AuthenticatedComponent>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
