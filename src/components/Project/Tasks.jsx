import React from "react";
import apiConfig from "apiConfig.js";
import { Table } from "reactstrap";
import Axios from "axios";
import { apiGet } from "helpers/api";
import ReactLoading from "react-loading";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      resourceId: this.props.location.state.resourceId,
      loadingTask: false,
    };
  }

  componentDidMount() {
    this.getTasks();
  }

  getTasks() {
    this.setState({
      loadingTask: true,
    });
    apiGet("project/tasks/" + this.state.resourceId).then((result) => {
      this.setState({
        tasks: result.data,
        loadingTask: false,
      });
    });
  }

  render() {
    return (
      <div className="content box-component-wrapper">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <h3 className="content-header">Tasks</h3>
        </div>
        <div className="tableFixHead">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Duration</th>
                <th>Start</th>
                <th>Finish</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {this.state.loadingTask ? (
                <tr>
                  <td colSpan="6">
                    <div className="d-flex justify-content-center align-items-center">
                      <ReactLoading type="bars" color="#204051" />
                    </div>
                  </td>
                </tr>
              ) : this.state.tasks.length === 0 ? (
                <tr>
                  <td className="text-center" colSpan="6">
                    No Tasks
                  </td>
                </tr>
              ) : (
                ""
              )}
              {this.state.tasks.map((parentTask) => {
                return [
                  <tr key={parentTask.id}>
                    <td style={{ fontWeight: "bold" }}>{parentTask.id}</td>
                    <td colSpan="5" style={{ fontWeight: "bold" }}>
                      {parentTask.name}
                    </td>
                  </tr>, // note the comma
                  parentTask.tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>{task.name}</td>
                      <td>{task.duration}</td>
                      <td>{task.start}</td>
                      <td>{task.finish}</td>
                      <td>{task.notes}</td>
                    </tr>
                  )),
                ];
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Tasks;
