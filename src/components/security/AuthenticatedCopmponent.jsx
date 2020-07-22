import React from "react";
import { getJwt } from "helpers/jwt";
import axios from "axios";
import { withRouter, Redirect } from "react-router-dom";
import { apiGet } from "helpers/api";
import ReactLoading from "react-loading";

class AuthenticatedComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
    };
  }

  componentDidMount() {
    const jwt = getJwt();
    if (!jwt) {
      this.props.history.push("/login");
    } else {
      apiGet("user/me")
        .then((res) => {
          this.setState({
            user: res.data.username,
          });
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("jwt-token");
          this.props.history.push("/login");
        });
    }
  }
  render() {
    if (this.state.user === undefined) {
      return (
        <div className="fluid-container loading-container">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-6 d-flex justify-content-center align-items-center">
              <ReactLoading type="bars" color="#204051" />
            </div>
          </div>
        </div>
      );
    }
    return <div>{this.props.children}</div>;
  }
}

export default withRouter(AuthenticatedComponent);
