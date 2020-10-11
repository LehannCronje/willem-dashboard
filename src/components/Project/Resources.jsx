import React from "react";
import apiConfig from "apiConfig.js";
import { Table } from "reactstrap";
import projectRoutes from "routes/projectRoutes.js";
import {Link} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "react-bootstrap/Button";
import { getJwt } from "helpers/jwt";
import { apiGet } from "helpers/api";
import { apiPost } from "helpers/api";
import ReactLoading from "react-loading";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";


class Resources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      projectId: localStorage.getItem("projectId"),
      taskListData: new Map(),
      checkbox: new Map(),
      checkall: true,
      isLoadingResources: false,
      selectedFilter: localStorage.getItem("filterType") === null ? "Weeks" :  localStorage.getItem("filterType"),
      filterDropdownOpen:false,
      filterInputValue: localStorage.getItem("timeValue") === null ? "2" :  localStorage.getItem("timeValue"),
      filterButtonText:"Add filter"
    };
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleUnCheckAll = this.handleUnCheckAll.bind(this);
    this.handleFilterInputChange = this.handleFilterInputChange.bind(this);
    this.handlerAddFilterButton = this.handlerAddFilterButton.bind(this);
  }

  componentDidMount() {
    this.getResources();
  }

  getResources() {
    const jwt = getJwt();
    let url = apiConfig.apiHost + "/project/";
    this.setState({
      isLoadingResources: true,
    });
    apiGet("project/resources/" + this.state.projectId).then((res) => {
      this.setState({
        resources: res.data,
        isLoadingResources: false,
      });
    });
  }

  handleFilterInputChange(e){
    this.setState({
      filterInputValue: e.target.value,
    })
  }

  taskListReportData(id) {
    apiGet("project/tasks" + id).then((result) => {
      this.setState({
        taskListData: this.state.taskListData.set(id, result),
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
      ),
      checkall: true,
    });
  }

  handleDropdown(selectedItem){
    this.setState({
      selectedFilter: selectedItem,
    })
  }

  toggleDropdown(){
    this.setState({
      filterDropdownOpen: !this.state.filterDropdownOpen,
    })
  }

  handleCheckAll() {
    var newCheckBox = new Map();
    var resource;
    for (resource in this.state.resources) {
      newCheckBox.set(this.state.resources[resource].id, true);
    }

    this.setState({
      checkbox: newCheckBox,
      checkall: false,
    });
  }

  handleUnCheckAll() {
    var newCheckBox = new Map();
    var resource;
    for (resource in this.state.resources) {
      newCheckBox.set(this.state.resources[resource].id, false);
    }

    this.setState({
      checkbox: newCheckBox,
      checkall: true,
    });
  }

  handleCheckSubmit() {
    const formData = new FormData();

    let iterator = this.state.checkbox.entries();
    let resourceList = [];
    this.state.checkbox.forEach((value, key, map) => {
      if(this.state.checkbox.get(key)){
        resourceList.push(key);
      }
      
    });


    formData.append("data", resourceList);
    formData.append("filterType", this.state.selectedFilter === "" ? "Weeks" : this.state.selectedFilter);
    formData.append("timeValue", this.state.filterInputValue === "" ? "2" : this.state.filterInputValue);

    let config = {
      responseType: "arraybuffer",
    };

    apiPost("report/taskList", formData, config).then((res) => {
      console.log(res);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "download.zip");
      document.body.appendChild(link);
      link.click();
    });
  }

  handlerAddFilterButton(){

    localStorage.setItem("filterType", this.state.selectedFilter === "" ? "Weeks" : this.state.selectedFilter)
    localStorage.setItem("timeValue", this.state.filterInputValue === "" ? "2" : this.state.filterInputValue,)

    this.setState({
      filterButtonText: "filter Added"
    })

    setTimeout(() => { this.setState({
      filterButtonText: "Add Filter",
    }) }, 3000);

  }

  render() {
    return (
      <div className="content box-component-wrapper">
        <div className="col-12">
          <div className="row">
            <div className="col-4">
              <button
                className="btn btn-create"
                onClick={() => this.handleCheckSubmit()}
              >
                generate Pdf
              </button>
              {this.state.checkall ? (
                <button
                  className="btn btn-create"
                  onClick={() => this.handleCheckAll()}
                >
                  Check All
                </button>
              ) : (
                <button
                  className="btn btn-create"
                  onClick={() => this.handleUnCheckAll()}
                >
                  Uncheck All
                </button>
              )}
            </div>
            <div className="col-3  d-flex justify-content-center align-items-center">
              <h3 className="content-header">Resources</h3>
            </div>
            <div className="col-5  d-flex justify-content-center align-items-center">
              <p className="filter-input-text">Look ahead: </p>
              <input className="filter-input" type="text" onChange={this.handleFilterInputChange} value={this.state.filterInputValue}/>
              <Dropdown
                    isOpen={this.state.filterDropdownOpen}
                    toggle={() => this.toggleDropdown()}
                  >
                    <DropdownToggle className="btn btn-create" caret>
                      {this.state.selectedFilter !== "" ? this.state.selectedFilter : "Select Type"}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Select Type</DropdownItem>

                      <DropdownItem
                        onClick={() => this.handleDropdown("Hours")}
                      >
                        Hours
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => this.handleDropdown("Days")}
                      >
                        Days
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => this.handleDropdown("Weeks")}
                      >
                        Weeks
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <button onClick={() => this.handlerAddFilterButton()} className="btn btn-create">{this.state.filterButtonText}</button>
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
              {this.state.isLoadingResources ? (
                <tr>
                  <td colSpan="4">
                    <div className="d-flex justify-content-center align-items-center">
                      <ReactLoading type="bars" color="#204051" />
                    </div>
                  </td>
                </tr>
              ) : this.state.resources.length === 0 ? (
                <tr>
                  <td className="text-center" colSpan="4">
                    No Resources
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
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
                      className="table-link"
                      to={{
                        pathname:
                          projectRoutes[2].layout + projectRoutes[2].path,
                        state: { resourceId: resource.id , selectedFilter: this.state.selectedFilter, filterInputValue: this.state.filterInputValue},
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
