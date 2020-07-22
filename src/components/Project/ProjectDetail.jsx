import React from "react";
import UpdateReport from "components/Report/updateReport.jsx";
import Resources from "components/Project/Resources.jsx";

class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    if (props.location.state !== undefined) {
      localStorage.setItem("projectId", props.location.state.projectId);
    }
  }

  render() {
    return (
      <div className="content col-12">
        <div className="row">
          <div className="col-12">
            <Resources />
          </div>
          {/* <div className="col-12">
            <UpdateReport />
          </div> */}
        </div>
      </div>
    );
  }
}

export default ProjectDetails;
