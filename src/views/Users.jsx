import React from "react";
import UserAccountList from "components/Users/UserAccountList";

class User extends React.Component {
  render() {
    return (
      <div className="content">
        <UserAccountList />
      </div>
    );
  }
}

export default User;
