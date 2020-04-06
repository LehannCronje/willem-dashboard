import React from "react";
import { getJwt } from "helpers/jwt";
import axios from "axios";
import { withRouter, Redirect } from "react-router-dom";
import { apiGet } from "helpers/api";

class AuthenticatedComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined
    };

    console.log(props);
  }

  componentDidMount() {
    const jwt = getJwt();
    if (!jwt) {
      this.props.history.push("/login");
    } else {
      apiGet("user/me")
        .then(res => {
          this.setState({
            user: res.data.username
          });
        })
        .catch(err => {
          console.log(err);
          localStorage.removeItem("jwt-token");
          this.props.history.push("/login");
        });
    }
  }
  render() {
    if (this.state.user === undefined) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }
    return <div>{this.props.children}</div>;
  }
}

export default withRouter(AuthenticatedComponent);
