import React from "react";
import "./popup.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { DropdownItem } from "reactstrap";

class ChangePasswordPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.renderPopup,
      name: "",
      formData: this.props.data,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.eventHandler = this.eventHandler.bind(this);
    this.generateForm = this.generateForm.bind(this);
  }

  componentWillReceiveProps(newprops) {
    if (newprops.show !== this.props.popup) {
      console.log(this.props.renderPopup);
      this.setState({ show: newprops.renderPopup });
    }
  }

  handleShow() {
    console.log(this.props.renderPopup);
    this.props.toggleUpload();
    this.setState({
      show: !this.state.show,
    });
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

    for (let x in this.state.formData) {
      data[x] = this.state.formData[x];
    }
    data.username = this.props.username;
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

  render() {
    return (
      <>
        <div
          onClick={this.handleShow}
          className="dropdown-item"
          role="menu-item"
          style={{ width: "100%", height: "100%" }}
        >
          Change Password
        </div>

        <Modal show={this.state.show} onHide={this.handleShow}>
          <Modal.Header closeButton>
            {/* <Modal.Title>{this.state.title}</Modal.Title> */}
          </Modal.Header>
          <Modal.Body>
            <this.generateForm />
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-action" onClick={this.eventHandler}>
              {this.props.buttonText}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ChangePasswordPopup;
