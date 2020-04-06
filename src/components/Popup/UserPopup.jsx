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

class UserPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      name: "",
      formData: this.props.data,
      dropdownOpen: false,
      addedProjects: [],
      projects: [],
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
    console.log(data);
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

  getProjects() {
    apiGet("project/all")
      .then((res) => {
        this.setState(
          {
            projects: res.data,
          },
          () => {
            console.log(this.state.projects);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <>
        <Button variant="btn btn-success" onClick={this.handleShow}>
          Create
        </Button>

        <Modal show={this.state.show} onHide={this.handleShow}>
          <Modal.Header closeButton>
            <Modal.Title>Create Farm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <this.generateForm />
            <div>
              <p>Added Projects</p>
              {this.state.addedProjects.map((addedProject, i) => (
                <p key={i}>{addedProject.name}</p>
              ))}
            </div>
            <Dropdown
              isOpen={this.state.dropdownOpen}
              toggle={() => this.toggleDropdown()}
            >
              <DropdownToggle caret>Add</DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Add Project</DropdownItem>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleShow}>
              Close
            </Button>
            <Button variant="primary" onClick={this.eventHandler}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default UserPopup;
