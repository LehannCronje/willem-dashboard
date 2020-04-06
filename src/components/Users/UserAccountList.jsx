import React from "react";
import { apiPost } from "helpers/api";
import { Table } from "reactstrap";
import { apiGet } from "helpers/api";
import UserPopup from "components/Popup/UserPopup";

class UserAccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccounts: [],
      formData: {
        username: "",
        password: "",
        role: "",
      },
    };
    this.componentPost = this.componentPost.bind(this);
  }

  componentDidMount() {
    this.getUserAccounts();
  }

  getUserAccounts() {
    let url = "user/accounts";
    apiGet(url).then((result) =>
      this.setState({
        userAccounts: result.data,
      })
    );
  }

  componentPost(data) {
    let url = "user/create-account";
    apiPost(url, data).then(() => {
      this.getUserAccounts();
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
              <h3 className="component-header">Sites</h3>
            </div>
          </div>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>role</th>
            </tr>
          </thead>
          <tbody>
            {this.state.userAccounts.map((account, i) => (
              <tr key={i} ref={account.id}>
                <td>{account.id}</td>
                <td>{account.name}</td>
                <td>{account.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default UserAccountList;
