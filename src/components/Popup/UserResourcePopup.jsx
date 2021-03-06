import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { apiGet, apiPost } from "helpers/api";
import { Button, Modal } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import Checkbox from "@material-ui/core/Checkbox";

class UserResourcePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      userPorjectDropdownOpen: false,
      userResourceDropdownOpen: false,
      projects: [],
      resources: [],
      assignedResources: [],
      tempAssignedResources: [],
      removedResources: [],
      selectedProject: "",
      selectedResource: "",
      checkbox: new Map(),
    };
    this.handleShow = this.handleShow.bind(this);
    this.addResource = this.addResource.bind(this);
    this.postUpdatedUserResources = this.postUpdatedUserResources.bind(this);
    this.removeResource = this.removeResource.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  componentDidMount() {
    this.getAssignedResources();
    this.getProjects();
  }

  handleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  toggleUserProjectDropdown() {
    this.setState({
      userPorjectDropdownOpen: !this.state.userPorjectDropdownOpen,
    });
  }

  toggleUserResourceDropdown() {
    this.setState({
      userResourceDropdownOpen: !this.state.userResourceDropdownOpen,
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

  getResources(projectId) {
    apiGet("project/resources/" + projectId).then((res) => {
      this.setState({
        resources: res.data,
      });
    });
  }

  getAssignedResources() {
    apiGet("user/account/project/resources/" + this.props.userId)
      .then((res) => {
        let data = res.data;
        this.setState({
          tempAssignedResources: [...data],
          assignedResources: [...data],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateUserResources() { }

  postUpdatedUserResources() {

    let removedResourcesIds = [];
    let addedResourcesIds = [];

    this.state.removedResources.forEach((element, index) => {
      removedResourcesIds.push(element.id);
    })

    this.state.tempAssignedResources.forEach((element, index) => {
      addedResourcesIds.push(element.id);
    })

    let data = {
      "removedResources": removedResourcesIds,
      "addedResources": addedResourcesIds,
      "userId": this.props.userId,
    }


    this.props.postMethod(data);
    this.handleShow();
  }

  removeResource(resource) {
    let tempArr = this.state.tempAssignedResources;
    let foundInAssignedResources = this.state.assignedResources.some(
      (el) => resource.id === el.id
    );

    let tempRemoveArr = this.state.removedResources;
    let resourceData = {
      id: resource.id,
      name: resource.name,
      projectName: this.state.selectedProject.name,
    };
    if (foundInAssignedResources) {
      tempRemoveArr.push(resourceData);
    }
    tempArr.forEach((r, index) => {
      if (r.id === resource.id) {
        if (index > -1) {
          tempArr.splice(index, 1);
        }
      }
    });
    this.setState({
      tempAssignedResources: tempArr,
    });
  }

  checkFoundInAssignedResources(resource) {
    return this.state.tempAssignedResources.some(
      (el) => resource.id === el.id
    );
  }
  addResource() {
    // let resource = this.state.selectedResource;
    let tempResourceList = this.state.tempAssignedResources;
    let tempRemoveArr = this.state.removedResources;

    // let foundInAssignedResources = this.state.tempAssignedResources.some(
    //   (el) => resource.id === el.id
    // );



    // if (!foundInAssignedResources) {
    //   let resourceData = {
    //     id: resource.id,
    //     name: resource.name,
    //     projectName: this.state.selectedProject.name,
    //   };
    //   tempResourceList.push(resourceData);
    //   this.setState({
    //     tempAssignedResources: tempResourceList,
    //   });
    // }
    this.state.checkbox.forEach((value, key, map) => {
      if (this.state.checkbox.get(key)) {
        let resource = this.state.resources.find(
          (el) => {
            if (key === el.id) {
              return el;
            }
          }
        );
        console.log(resource)
        // tempRemoveArr.forEach((r, index) => {
        //   if (r.id === resource.id) {
        //     if (index > -1) {
        //       tempRemoveArr.splice(index, 1);
        //     }
        //   }
        // });

        let resourceData = {
          id: resource.id,
          name: resource.name,
          projectName: this.state.selectedProject.name,
        };
        tempResourceList.push(resourceData);
        this.setState({
          tempAssignedResources: tempResourceList,
          checkbox: new Map()
        });
      }

    });

  }

  handleSelectedProject(project) {
    this.getResources(project.id);
    this.setState({
      selectedProject: project,
    });
  }

  handleSelectedResource(resource) {
    this.setState({
      selectedResource: resource,
    });
  }

  handleCheckChange(e) {
    let id = e.target.value;
    console.log(id);
    this.setState({
      checkbox: this.state.checkbox.set(
        e.target.value,
        this.state.checkbox.get(id) ? false : true
      ),
    });
  }

  render() {
    return (
      <>
        <button className="btn btn-action" onClick={this.handleShow}>
          {this.props.buttonText
            ? this.props.buttonText
            : "Manage User Resources"}
        </button>
        <Modal size="lg" show={this.state.show} onHide={this.handleShow}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className="col-12">
              <h3 className="text-center m-0">Add Resources</h3>
              <hr></hr>
              <div className="row d-flex justify-content-center align-items-center">
                <div className="col-12">
                  <Dropdown
                    isOpen={this.state.userPorjectDropdownOpen}
                    toggle={() => this.toggleUserProjectDropdown()}
                  >
                    <DropdownToggle className="btn btn-create w-100" caret>
                      Select Project
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Select Project</DropdownItem>
                      {this.state.projects.map((project, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => this.handleSelectedProject(project)}
                        >
                          {project.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <ListGroup.Item className="text-center selected-project"><strong>Selected Project: </strong>{this.state.selectedProject.name === undefined ? "Select a project" : this.state.selectedProject.name}</ListGroup.Item>
                </div>
                <div className="col-12">
                  {this.state.resources.map((resource, index) => {
                    // console.log(this.checkFoundInAssignedResources(resource));
                    if (!this.checkFoundInAssignedResources(resource)) {
                      return (<ListGroup.Item>
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
                        {resource.name}
                      </ListGroup.Item>
                      )
                    }
                  })}
                </div>
                {this.state.selectedProject.name === undefined ? "" : 
                <div className="col-2">
                  <button className="btn btn-action" onClick={this.addResource}>
                    Add
                  </button>
                </div>}
                
              </div>
            </div>
            <div className="col-12">
              <h3 className="text-center m-0">Assigned Resources</h3>
              <hr></hr>
              <ListGroup>
                {this.state.tempAssignedResources.length === 0 ? (
                  <div>
                    <p>no Resources</p>
                  </div>
                ) : (
                    this.state.tempAssignedResources.map((resource) => {
                      return (
                        <div className="col-12 ">
                          <div className="row d-flex">
                            <div className="col-10">
                              <ListGroup.Item>
                                {resource.name} | {resource.projectName}
                              </ListGroup.Item>
                            </div>
                            <div className="col-2 align-self-center">
                              <Button
                                className="btn btn-action"
                                onClick={() => this.removeResource(resource)}
                              >
                                Remove
                            </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
              </ListGroup>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-action"
              onClick={this.postUpdatedUserResources}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default UserResourcePopup;
