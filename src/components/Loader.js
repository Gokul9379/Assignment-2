import React from "react";
import "../Loader.css";

class Loader extends React.Component {
  render() {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
      </div>
    );
  }
}

export default Loader;
