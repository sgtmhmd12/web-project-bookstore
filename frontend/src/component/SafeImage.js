import React, { Component } from "react";

class SafeImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  handleError = () => {
    this.setState({ hasError: true });
  };

  render() {
    const { src, alt, className, style } = this.props;
    const { hasError } = this.state;

    return (
      <img
        src={hasError ? "/book-placeholder.png" : src}
        alt={alt}
        className={className}
        style={style}
        onError={this.handleError}
      />
    );
  }
}

export default SafeImage;
