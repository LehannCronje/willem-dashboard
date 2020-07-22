import React from "react";
import "./popup.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";

class UserProjectPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      name: "",
      addedProjects: [],
      removedProjects: [],
    };

    this.handleShow = this.handleShow.bind(this);
    this.eventHandler = this.eventHandler.bind(this);
  }

  handleShow() {
    this.setState({
      show: !this.state.show,
      addedProjects: [],
      removedProjects: [],
    });
  }

  eventHandler() {
    var data = {
      addedProjects: this.state.addedProjects,
      removedProjects: this.state.removedProjects,
      userId: this.props.userId,
    };
    this.props.postMethod(data);
    this.handleShow();
  }

  componentDidMount() {}

  handleProjectRemove(projectId) {
    var tempArr2 = this.state.addedProjects;
    if (tempArr2.includes(projectId)) {
      var index = tempArr2.indexOf(projectId);
      if (index > -1) {
        tempArr2.splice(index, 1);
      }
    }
    var tempArr = this.state.removedProjects;
    tempArr.push(projectId);
    this.setState({ removedProjects: tempArr, addedProjects: tempArr2 });
  }

  handleProjectAdd(projectId) {
    var tempArr2 = this.state.removedProjects;
    if (tempArr2.includes(projectId)) {
      var index = tempArr2.indexOf(projectId);
      if (index > -1) {
        tempArr2.splice(index, 1);
      }
    }
    var tempArr = this.state.addedProjects;
    tempArr.push(projectId);
    this.setState({ addedProjects: tempArr, removedProjects: tempArr2 });
  }

  isAssignedProject(projectId) {
    if (this.props.userProjects.includes(Number(projectId))) {
      if (this.state.addedProjects.includes(projectId)) {
        if (this.state.removedProjects.includes(projectId)) {
          return false;
        } else {
          return true;
        }
      } else {
        if (this.state.removedProjects.includes(projectId)) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      if (this.state.addedProjects.includes(projectId)) {
        if (this.state.removedProjects.includes(projectId)) {
          return false;
        } else {
          return true;
        }
      } else {
        if (this.state.removedProjects.includes(projectId)) {
          return false;
        } else {
          return false;
        }
      }
    }
  }

  render() {
    return (
      <>
        <button className="btn btn-action" onClick={this.handleShow}>
          {this.props.buttonText
            ? this.props.buttonText
            : "Manage User Projects"}
        </button>

        <Modal size="lg" show={this.state.show} onHide={this.handleShow}>
          <Modal.Header closeButton>
            {/* <Modal.Title>{this.state.title}</Modal.Title> */}
          </Modal.Header>
          <Modal.Body>
            <div>
              <h4 className="text-center">Unasigned projects</h4>
              <hr></hr>
              <ListGroup>
                {this.props.projects.map((project) => {
                  if (!this.isAssignedProject(project.id)) {
                    return (
                      <div className="col-12 ">
                        <div className="row d-flex">
                          <div className="col-10">
                            <ListGroup.Item>{project.name}</ListGroup.Item>
                          </div>
                          <div className="col-2 align-self-center">
                            <button
                              className="btn btn-create"
                              onClick={() => this.handleProjectAdd(project.id)}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </ListGroup>
              <h4 className="text-center">Assigned Projects</h4>
              <hr></hr>
              {this.props.projects.map((project) => {
                if (this.isAssignedProject(project.id)) {
                  return (
                    <div className="col-12">
                      <div className="row  d-flex">
                        <div className="col-10">
                          <ListGroup.Item>{project.name}</ListGroup.Item>
                        </div>
                        <div className="col-2 align-self-center">
                          <button
                            className="btn btn-create"
                            onClick={() => this.handleProjectRemove(project.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-action" onClick={this.eventHandler}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default UserProjectPopup;
