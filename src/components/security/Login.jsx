import React from "react";
import axios from "axios";
import { apiPost } from "helpers/api";
import ReactLoading from "react-loading";

class Login extends React.Component {
  constructor(props) {
    super(props);
    console.log("login");
    this.state = {
      username: "",
      password: "",
      error: false,
    };
    this.change = this.change.bind(this);
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  submit(e) {
    e.preventDefault();
    let data = {
      username: this.state.username,
      password: this.state.password,
    };
    apiPost("auth/signin", data)
      .then((res) => {
        localStorage.setItem("jwt-token", res.data.token);
        this.props.history.push("/admin/dashboard");
      })
      .catch((err) => {
        this.setState({
          error: true,
        });
      });
  }

  render() {
    return (
      <div className="login-wrapper fluid-container justify-content-center align-items-center d-flex">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-10 col-12 box-component-wrapper">
          {this.state.error ? <p>Incorrect Username or password</p> : ""}
          <form onSubmit={(e) => this.submit(e)}>
            <label>Username</label>
            <input
              className="form-control"
              type="text"
              name="username"
              onChange={(e) => this.change(e)}
              value={this.state.username}
            />
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              onChange={(e) => this.change(e)}
              value={this.state.password}
            />
            <input className="btn btn-action" type="submit" value="Sign in" />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
