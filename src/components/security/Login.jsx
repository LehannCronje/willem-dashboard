import React from "react";
import axios from "axios";
import { apiPost } from "helpers/api";

class Login extends React.Component {
  constructor(props) {
    super(props);
    console.log("login");
    this.state = {
      username: "",
      password: "",
      error: false
    };

    this.change = this.change.bind(this);
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  submit(e) {
    e.preventDefault();
    let data = {
      username: this.state.username,
      password: this.state.password
    };
    apiPost("auth/signin", data)
      .then(res => {
        localStorage.setItem("jwt-token", res.data.token);
        this.props.history.push("/admin/dashboard");
      })
      .catch(err => {
        this.setState({
          error: true
        });
      });
  }

  render() {
    return (
      <div className="login-wrapper">
        <div className="col-xl-4 col-md-6 box-component-wrapper">
          <h1 className="text-center">Login Form</h1>
          {this.state.error ? <p>Wrong credentials</p> : ""}
          <form onSubmit={e => this.submit(e)}>
            <label>Username</label>
            <input
              className="form-control"
              type="text"
              name="username"
              onChange={e => this.change(e)}
              value={this.state.username}
            />
            <label>Password</label>
            <input
              className="form-control"
              type="text"
              name="password"
              onChange={e => this.change(e)}
              value={this.state.password}
            />
            <input className="btn btn-primary" type="submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
