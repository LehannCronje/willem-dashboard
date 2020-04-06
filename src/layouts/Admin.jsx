import React from "react";
import routes from "routes/routes.js";
import { Route, Switch, Redirect } from "react-router-dom";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import Navbar from "components/Navbars/Navbar.jsx";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.mainPanel = React.createRef();
  }

  render() {
    if (
      this.props.location.pathname == "/" ||
      this.props.location.pathname == "/admin" ||
      this.props.location.pathname == "/admin/dashboard"
    ) {
      return <Redirect to="/admin/dashboard/project" />;
    }
    return (
      <div className="wrapper">
        <Sidebar {...this.props} routes={routes} />
        <div className="main-panel" ref={this.mainPanel}>
          <Navbar {...this.props} />

          <Switch>
            {routes.map((prop, key) => {
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={key}
                />
              );
            })}
          </Switch>
        </div>
      </div>
    );
  }
}

export default Dashboard;
