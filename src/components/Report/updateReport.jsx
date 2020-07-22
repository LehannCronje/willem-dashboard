import React from "react";
import apiConfig from "apiConfig.js";
import { Table } from "reactstrap";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import { getJwt } from "helpers/jwt";
import { apiGet, apiPost } from "helpers/api";

class updateReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateReport: [],
      projectId: localStorage.getItem("projectId"),
      checkbox: new Map(),
    };
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  componentDidMount() {
    this.getReports();
  }

  getReports() {
    apiGet("report/update-report/" + this.state.projectId).then((res) => {
      this.setState({
        updateReport: res.data,
      });
    });
  }

  handleCheckChange(e) {
    let id = e.target.value;

    this.setState({
      checkbox: this.state.checkbox.set(
        id,
        this.state.checkbox.get(id) ? false : true
      ),
    });
  }

  handleCheckSubmit() {
    const formData = new FormData();
    let resourceList = [];
    this.state.checkbox.forEach((value, key, map) => {
      resourceList.push(key);
    });

    formData.append("data", resourceList);

    let config = {
      responseType: "arraybuffer",
    };

    apiPost("report/updateReport/download", formData, config).then((res) => {
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
            <div className="col-1">
              <button className="btn" onClick={() => this.handleCheckSubmit()}>
                Download
              </button>
            </div>
            <div className="col-11 d-flex justify-content-center align-items-center">
              <h3 className="content-header">Mobile Update Reports</h3>
            </div>
          </div>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>check</th>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.updateReport.map((report, i) => (
              <tr key={i} ref={report.id}>
                <td>
                  <Checkbox
                    checked={
                      this.state.checkbox.get(report.id)
                        ? this.state.checkbox.get(report.id)
                        : false
                    }
                    onChange={this.handleCheckChange}
                    value={report.id}
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </td>
                <td>{report.id}</td>
                <td>{report.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default updateReport;
