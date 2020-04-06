import React from "react";

import ProjectList from "components/Project/ProjectList.jsx";

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ProjectList
          setDeleteLoading={this.setDeleteLoading}
          filesReload={this.state.filesReload}
        />
      </div>
    );
  }
}

export default Project;
