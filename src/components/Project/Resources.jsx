import React from "react";
import apiConfig from "apiConfig.js";
import { Table } from "reactstrap";
import projectRoutes from "routes/projectRoutes.js";
import { Route, Switch, Link, Router, Redirect } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "components/Pdf/TaskListPdf.jsx";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import { save } from "save-file";

import { getJwt } from "helpers/jwt";
import { apiGet } from "helpers/api";
import { apiPost } from "helpers/api";

class Resources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      projectId: localStorage.getItem("projectId"),
      taskListData: new Map(),
      checkbox: new Map()
    };
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  componentDidMount() {
    this.getResources();
  }

  getResources() {
    const jwt = getJwt();
    let url = apiConfig.apiHost + "/project/";

    apiGet("project/resources/" + this.state.projectId).then(res => {
      this.setState({
        resources: res.data
      });
    });
  }

  taskListReportData(id) {
    apiGet("project/tasks" + id).then(result => {
      this.setState({
        taskListData: this.state.taskListData.set(id, result)
      });
    });
  }

  handleTaskList(id) {
    this.taskListReportData(id);
  }

  handleCheckChange(e) {
    let id = e.target.value;
    this.setState({
      checkbox: this.state.checkbox.set(
        e.target.value,
        this.state.checkbox.get(id) ? false : true
      )
    });
  }

  handleCheckSubmit() {
    const formData = new FormData();

    let iterator = this.state.checkbox.entries();
    let resourceList = [];
    this.state.checkbox.forEach((value, key, map) => {
      resourceList.push(key);
    });

    formData.append("data", resourceList);

    let config = {
      responseType: "arraybuffer"
    };

    apiPost("report/taskList", formData, config).then(res => {
      console.log(res);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "download.zip");
      document.body.appendChild(link);
      link.click();
    });
  }

  render() {
    return (
      <div className="content box-component-wrapper">
        <div className="col-12">
          <div className="row">
            <div className="col-4">
              <button className="btn" onClick={() => this.handleCheckSubmit()}>
                generate Pdf
              </button>
            </div>
            <div className="col-4  d-flex justify-content-center align-items-center">
              <h3 className="content-header">Resources</h3>
            </div>
          </div>
        </div>
        <div className="tableFixHead">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>check</th>
                <th>ID</th>
                <th>Name</th>
                <th>Task List</th>
              </tr>
            </thead>
            <tbody>
              {this.state.resources.map((resource, i) => (
                <tr key={i} ref={resource.id}>
                  <td>
                    <Checkbox
                      checked={
                        this.state.checkbox.get(resource.id)
                          ? this.state.checkbox.get(resource.id)
                          : false
                      }
                      onChange={this.handleCheckChange}
                      value={resource.id}
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </td>
                  <td>{resource.id}</td>
                  <td>{resource.name}</td>
                  <td>
                    <Link
                      to={{
                        pathname:
                          projectRoutes[2].layout + projectRoutes[2].path,
                        state: { resourceId: resource.id }
                      }}
                    >
                      View Task List
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Resources;
