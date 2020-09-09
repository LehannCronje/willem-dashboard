import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./popup.css";
import Upload from "components/Upload/Upload";
import Progress from "components/Progress/ProgressBar.jsx";
import { apiPost } from "helpers/api";
import { DropdownItem } from "reactstrap";

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.renderUpload,
      name: "",
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false,
      url: this.props.url,
    };
    this.handleShow = this.handleShow.bind(this);
    this.eventHandler = this.eventHandler.bind(this);

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderProgress = this.renderProgress.bind(this);
  }

  componentWillReceiveProps(newprops) {
    if (!this.props.element) {
      this.setState({ show: newprops.renderUpload });
    }
  }
  handleShow() {
    this.props.toggleUpload();
    this.setState({ show: !this.state.show });
  }

  eventHandler() {
    this.setState({
      save: true,
    });

    this.handleShow();
  }

  //Upload methods

  onFilesAdded(files) {
    this.setState((prevState) => ({
      files: prevState.files.concat(files),
    }));
  }
  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <button
          className="btn btn-action"
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Clear
        </button>
      );
    } else {
      if (this.props.element === "button") {
        return (
          <button
            className="btn btn-action"
            disabled={this.state.files.length < 0 || this.state.uploading}
            onClick={this.uploadFiles}
          >
            Create project
          </button>
        );
      } else if (this.props.element === "dropdown") {
        return (
          <button
            className="btn btn-action"
            disabled={this.state.files.length < 0 || this.state.uploading}
            onClick={this.uploadFiles}
          >
            Update Project
          </button>
        );
      }
    }
  }
  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach((file) => {
      this.props.toggleFilesReload(false);
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);

      this.setState({ successfullUploaded: true, uploading: false });
      this.props.toggleUpload();
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file, file.name);
      if (this.props.projectId) {
        formData.append("puid", this.props.projectId);
      }

      var jsonData = {
        "projectId": 1
      }
      var data = new FormData();
      data.append("projectFile",file);
      data.append("projectId",1);

      let config = {
        onUploadProgress: function (progressEvent) {
          const copy = { ...this.state.uploadProgress };
          var percentCompleted = Math.round(
            (progressEvent.loaded * 98) / progressEvent.total
          );
          copy[file.name] = {
            state: "pending",
            percentage: percentCompleted,
          };
          this.setState({ uploadProgress: copy });
        }.bind(this),
      };

      apiPost(this.props.url, formData, config)
        .then((res) => {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: "done", percentage: 100 };
          this.setState({
            uploadProgress: copy,
            show: false,
          });

          this.props.toggleFilesReload();
          resolve(res.statusText);
        })
        .catch((e) => {
          alert(
            "File with that name already exists. Please choose another name"
          );
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: "done", percentage: 100 };
          this.setState({
            uploadProgress: copy,
          });
          resolve(e);
        });
    });
  }

  getType() {
    if (this.props.element === "button") {
      return (
        <Button variant="btn btn-create" onClick={this.handleShow}>
          Create
        </Button>
      );
    }
    if (this.props.element === "dropdown") {
      return (
        <div
          className="dropdown-item"
          role="menu-item"
          style={{ width: "100%", height: "100%", display: "none" }}
        >
          Update
        </div>
      );
    }
  }
  render() {
    return (
      <>
        {this.getType()}
        <Modal size="lg" show={this.state.show} onHide={this.handleShow}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Upload
              toggleUpload={this.props.toggleUpload}
              toggleFilesReload={this.props.toggleFilesReload}
              onFilesAdded={this.onFilesAdded}
              renderProgress={this.renderProgress}
              uploading={this.state.uploading}
              successfullUploaded={this.state.successfullUploaded}
              files={this.state.files}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleShow}>
              Close
            </Button>
            <div className="Actions">{this.renderActions()}</div>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Popup;
