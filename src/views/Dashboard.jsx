import React from "react";

import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import { Route, Switch, Router, BrowserRouter, Link } from "react-router-dom";
import projectRoutes from "routes/projectRoutes.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="content">
        {projectRoutes.map((prop, key) => {
          return (
            <Route
              exact
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        })}
      </div>
    );
  }
}

export default Dashboard;
