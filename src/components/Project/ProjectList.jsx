import React from "react";
import axios from "axios";
import apiConfig from "apiConfig.js";
import { Route, Switch, Link, Router, Redirect } from "react-router-dom";
import projectRoutes from "routes/projectRoutes.js";
import { getJwt } from "helpers/jwt";
import { apiGet, apiPost } from "helpers/api";
import { Table } from "reactstrap";
import Popup from "components/Popup/Popup.jsx";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ReactLoading from "react-loading";

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      isLoading: false,
      renderUpload: false,
      deleteLoading: false,
      filesReload: false,
      dropdownOpen: new Map(),
      loadingProjects: false,
    };

    this.toggleUpload = this.toggleUpload.bind(this);
    this.setDeleteLoading = this.setDeleteLoading.bind(this);
    this.toggleFilesReload = this.toggleFilesReload.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.unlockProject = this.unlockProject.bind(this);
    this.lockProject = this.lockProject.bind(this);
  }

  componentDidMount() {
    this.getProjects();
  }

  getProjects() {
    const jwt = getJwt();
    let url = apiConfig.apiHost + "/project/";
    this.setState({
      loadingProjects: true,
    });
    apiGet("project/all")
      .then((res) => {
        this.setState({
          projects: res.data,
          loadingProjects: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleDelete(id) {
    const formData = new FormData();
    formData.append("uid", id);

    apiPost("project/delete", formData)
      .then((res) => {
        console.log(res);
        this.getProjects();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  toggleUpload() {
    this.setState((prevState) => ({
      renderUpload: !prevState.renderUpload,
    }));
  }

  toggleFilesReload() {
    this.getProjects();
  }

  setDeleteLoading() {
    this.setState((prevState) => ({
      setDeleteLoading: !prevState.deleteLoading,
    }));
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

  handlePopup() {
    this.setState((prevState) => ({
      renderUpload: !prevState.renderUpload,
    }));
  }

  lockProject(projectId) {
    var url = "project/lock/" + projectId;
    apiGet(url).then(() => {
      this.getProjects();
    });
  }

  unlockProject(projectId) {
    var url = "project/unlock/" + projectId;
    apiGet(url).then(() => {
      this.getProjects();
    });
  }

  downloadReport(projectId) {
    var url = "report/update-report/download/" + projectId;

    let config = {
      responseType: "arraybuffer",
    };

    apiGet(url, config).then((res) => {
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
              <Popup
                toggleHandler={this.toggleHandler}
                toggleUpload={this.toggleUpload}
                toggleFilesReload={this.toggleFilesReload}
                updateProjects={this.getProjects}
                element="button"
                url="project/create"
              />
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center">
              <h3 className="component-header">Projects</h3>
            </div>
          </div>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th style={{ width: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.loadingProjects ? (
              <tr>
                <td colSpan="3">
                  <div className="d-flex justify-content-center align-items-center">
                    <ReactLoading type="bars" color="#204051" />
                  </div>
                </td>
              </tr>
            ) : this.state.projects.length === 0 ? (
              <tr>
                <td className="text-center" colSpan="3">
                  No Projects
                </td>
              </tr>
            ) : (
              <tr></tr>
            )}
            {this.state.projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>
                  <Link
                    className="table-link"
                    to={{
                      pathname: projectRoutes[1].layout + projectRoutes[1].path,
                      state: { projectId: project.id },
                    }}
                  >
                    {project.name}
                  </Link>
                </td>
                <td style={{ padding: "0px", textAlign: "center" }}>
                  <Dropdown
                    direction="left"
                    isOpen={
                      this.state.dropdownOpen.get(project.id)
                        ? this.state.dropdownOpen.get(project.id)
                        : false
                    }
                    toggle={() => this.toggleDropdown(project.id)}
                  >
                    <DropdownToggle
                      tag="span"
                      data-toggle="dropdown"
                      aria-expanded={
                        this.state.dropdownOpen.get(project.id)
                          ? this.state.dropdownOpen.get(project.id)
                          : false
                      }
                    >
                      <div className="test"></div>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Project Properties</DropdownItem>

                      <Popup
                        style={{ display: "none" }}
                        toggleHandler={this.toggleHandler}
                        toggleUpload={this.toggleUpload}
                        toggleFilesReload={this.toggleFilesReload}
                        updateProjects={this.getProjects}
                        element="dropdown"
                        url="project/update"
                        projectId={project.id}
                        renderUpload={this.state.renderUpload}
                      />
                      <DropdownItem onClick={() => this.toggleUpload()}>
                        Update
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => this.handleDelete(project.id)}
                      >
                        Delete
                      </DropdownItem>
                      {project.isLocked === "false" ? (
                        <DropdownItem
                          onClick={() => this.lockProject(project.id)}
                        >
                          Lock Project
                        </DropdownItem>
                      ) : (
                        [
                          <DropdownItem
                            onClick={() => this.unlockProject(project.id)}
                          >
                            Unlock Project
                          </DropdownItem>,
                          <DropdownItem
                            onClick={() => this.downloadReport(project.id)}
                          >
                            Download Update Report
                          </DropdownItem>,
                        ]
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default ProjectList;
