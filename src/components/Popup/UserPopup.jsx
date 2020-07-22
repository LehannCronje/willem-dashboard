import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./popup.css";
import { apiGet } from "helpers/api";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ListGroup from "react-bootstrap/ListGroup";

class UserPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      name: "",
      formData: this.props.data,
      dropdownOpen: false,
      roleDropdownOpen: false,
      addedProjects: [],
      projects: [],
      selectedRole: "",
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.eventHandler = this.eventHandler.bind(this);
    this.generateForm = this.generateForm.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  handleShow() {
    this.setState({ show: !this.state.show });
  }
  handleChange(e) {
    let tempData = { ...this.state.formData };
    let inputName = e.target.name;
    tempData[inputName] = e.target.value;
    this.setState({
      formData: tempData,
    });
  }
  eventHandler() {
    var data = {};
    let projects = [];
    for (let key in this.state.addedProjects) {
      projects.push(this.state.addedProjects[key].id);
    }
    for (let x in this.state.formData) {
      data[x] = this.state.formData[x];
    }
    data["projects"] = projects;
    data.role = this.state.selectedRole;
    this.props.postMethod(data);
    this.handleShow();
  }

  labelFormat(string) {
    let firstChar = string.charAt(0).toUpperCase();
    let newString =
      firstChar +
      string
        .slice(1)
        .replace(/([A-Z])/g, " $1")
        .trim();

    return newString;
  }

  componentDidMount() {
    this.generateForm();
    this.getProjects();
  }
  generateForm() {
    let form = [];
    for (let x in this.state.formData) {
      if (x === "uid" || x === "farmId" || x === "siteId") {
      } else {
        form.push(
          <label className="form-label" key={x}>
            {this.labelFormat(x)}
            <input
              type="text"
              value={this.state.formData[x]}
              name={x}
              onChange={this.handleChange}
            />
          </label>
        );
      }
    }
    return form;
  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  toggleRoleDropdown() {
    this.setState({
      roleDropdownOpen: !this.state.roleDropdownOpen,
    });
  }

  handleAddProject(project) {
    let temp = this.state.addedProjects;
    let found = temp.some((el) => el.id === project.id);
    if (found === false) {
      temp.push(project);
      this.setState({
        addedProjects: temp,
      });
    } else {
      alert("project already exists");
    }
  }

  handleRoleDropdown(role) {
    this.setState({
      selectedRole: role,
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

  render() {
    return (
      <>
        <Button variant="btn btn-create" onClick={this.handleShow}>
          Create
        </Button>

        <Modal show={this.state.show} onHide={this.handleShow}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <this.generateForm />
            <div className="col-12">
              <div className="row d-flex justify-content-center align-items-center">
                <div className="col-4">
                  <Dropdown
                    isOpen={this.state.roleDropdownOpen}
                    toggle={() => this.toggleRoleDropdown()}
                  >
                    <DropdownToggle className="btn btn-create" caret>
                      Select Role
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Select Role</DropdownItem>

                      <DropdownItem
                        onClick={() => this.handleRoleDropdown("ROLE_MOBILE")}
                      >
                        Mobile role
                      </DropdownItem>
                      {/* <DropdownItem
                        onClick={() => this.handleRoleDropdown("ROLE_USER")}
                      >
                        User role
                      </DropdownItem> */}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="col-8">
                  <ListGroup.Item className="h-100">
                    {this.state.selectedRole
                      ? this.state.selectedRole
                      : "Select a role"}
                  </ListGroup.Item>
                </div>
              </div>
            </div>

            <hr />
            <div className="col-12">
              <div className="row d-flex justify-content-center align-items-center">
                <div className="col-4">
                  <Dropdown
                    className=" mr-5"
                    isOpen={this.state.dropdownOpen}
                    toggle={() => this.toggleDropdown()}
                  >
                    <DropdownToggle className="btn btn-create" caret>
                      Add Project
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Select Project Project</DropdownItem>
                      {this.state.projects.map((project, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => this.handleAddProject(project)}
                        >
                          {project.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="col-8">
                  <h4 className="m-0 text-center">Added Projects</h4>
                </div>
              </div>
              <ListGroup>
                {this.state.addedProjects.map((addedProject, i) => (
                  <ListGroup.Item key={i}>{addedProject.name}</ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="btn btn-action" onClick={this.eventHandler}>
              Create User
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default UserPopup;
