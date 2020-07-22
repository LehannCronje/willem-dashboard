import React from "react";
import { apiPost } from "helpers/api";
import { Table } from "reactstrap";
import { apiGet } from "helpers/api";
import UserPopup from "components/Popup/UserPopup";
import ChangePasswordPopup from "components/Popup/ChangePasswordPopup";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import UserProjectPopup from "components/Popup/UserProjectPopup";
import ReactLoading from "react-loading";

class UserAccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccounts: [],
      formData: {
        username: "",
        password: "",
      },
      changePasswordData: {
        newPassword: "",
      },
      dropdownOpen: new Map(),
      projects: [],
      isLoading: false,
      renderPopup: false,
    };
    this.componentPost = this.componentPost.bind(this);
    this.changeUserPasswordPost = this.changeUserPasswordPost.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.updateUserProjectsPost = this.updateUserProjectsPost.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
  }

  componentDidMount() {
    this.getUserAccounts();
    this.getProjects();
  }

  toggleUpload() {
    this.setState({
      renderPopup: !this.state.renderPopup,
    });
  }

  getProjects() {
    apiGet("project/all")
      .then((res) => {
        this.setState({
          projects: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleDropdown(id) {
    this.setState({
      dropdownOpen: this.state.dropdownOpen.set(
        id,
        this.state.dropdownOpen.get(id)
          ? !this.state.dropdownOpen.get(id)
          : true
      ),
    });
  }

  getUserAccounts() {
    let url = "user/accounts";
    this.setState({
      isLoading: true,
    });
    apiGet(url).then((result) =>
      this.setState({
        userAccounts: result.data,
        isLoading: false,
      })
    );
  }

  componentPost(data) {
    let url = "user/create-account";
    apiPost(url, data).then(() => {
      this.getUserAccounts();
    });
  }

  changeUserPasswordPost(data) {
    let url = "user/changepassword";
    apiPost(url, data).then(() => {
      this.getUserAccounts();
      alert("password changed");
    });
  }

  deactivateUser(username) {
    let url = "user/deactivateuser";
    var data = {
      username: username,
    };
    apiPost(url, data).then(() => {
      this.getUserAccounts();
    });
  }

  activateUser(username) {
    let url = "user/activateuser";
    var data = {
      username: username,
    };
    apiPost(url, data).then(() => {
      this.getUserAccounts();
      this.getProjects();
    });
  }

  updateUserProjectsPost(data) {
    let url = "user/updateProjects";

    apiPost(url, data).then(() => {
      this.getUserAccounts();
      this.getProjects();
    });
  }

  render() {
    return (
      <div className="content box-component-wrapper">
        <div className="col-12">
          <div className="row">
            <div className="col-4">
              <UserPopup
                postMethod={this.componentPost}
                data={this.state.formData}
              />
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center">
              <h3 className="component-header">Users</h3>
            </div>
          </div>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>role</th>
              <th>State</th>
              <th>Projects</th>
              <th style={{ width: "10%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.isLoading ? (
              <tr>
                <td colSpan="6">
                  <div className="d-flex justify-content-center align-items-center">
                    <ReactLoading type="bars" color="#204051" />
                  </div>
                </td>
              </tr>
            ) : this.state.userAccounts.length === 0 ? (
              <tr>
                <td className="text-center" colSpan="6">
                  No Users
                </td>
              </tr>
            ) : (
              this.state.userAccounts.map((account, i) => (
                <tr key={i} ref={account.id}>
                  <td>{account.id}</td>
                  <td>{account.name}</td>
                  <td>{account.role}</td>
                  <td>{account.isActive}</td>
                  <td>
                    <UserProjectPopup
                      postMethod={this.updateUserProjectsPost}
                      projects={this.state.projects}
                      userProjects={account.projects}
                      userId={account.id}
                    />
                  </td>
                  <td style={{ padding: "0px", textAlign: "center" }}>
                    <Dropdown
                      direction="left"
                      isOpen={
                        this.state.dropdownOpen.get(account.id)
                          ? this.state.dropdownOpen.get(account.id)
                          : false
                      }
                      toggle={() => this.toggleDropdown(account.id)}
                    >
                      <DropdownToggle
                        tag="span"
                        data-toggle="dropdown"
                        aria-expanded={
                          this.state.dropdownOpen.get(account.id)
                            ? this.state.dropdownOpen.get(account.id)
                            : false
                        }
                      >
                        <div className="test"></div>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Project Properties</DropdownItem>

                        <ChangePasswordPopup
                          postMethod={this.changeUserPasswordPost}
                          data={this.state.changePasswordData}
                          buttonText="Change Password"
                          username={account.name}
                          renderPopup={this.state.renderPopup}
                          toggleUpload={this.toggleUpload}
                        />

                        {account.isActive === "ACTIVE" ? (
                          <DropdownItem
                            onClick={() => this.deactivateUser(account.name)}
                          >
                            Deactivate User
                          </DropdownItem>
                        ) : (
                          <DropdownItem
                            onClick={() => this.activateUser(account.name)}
                          >
                            Activate User
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default UserAccountList;
