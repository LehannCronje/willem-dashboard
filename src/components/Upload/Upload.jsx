import React from "react";
import Dropzone from "components/Dropzone/Dropzone.jsx";
import "assets/css/upload.css";
import Progress from "components/Progress/ProgressBar.jsx";
import axios from "axios";
import apiConfig from "apiConfig.js";
import { apiPost } from "helpers/api";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Upload">
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.props.onFilesAdded}
              disabled={this.props.uploading || this.props.successfullUploaded}
            />
          </div>
          <div className="Files">
            {this.props.files.map(file => {
              return (
                <div key={file.name} className="Row">
                  <span className="Filename">{file.name}</span>
                  {this.props.renderProgress(file)}
                </div>
              );
            })}
          </div>
        </div>
        {/* <div className="Actions">{this.renderActions()}</div> */}
      </div>
    );
  }
}

export default Upload;
