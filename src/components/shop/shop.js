import React from 'react';
import GenericComponent from "../common/genericComponent";


class Shop extends GenericComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: true,
      dto: null
    };
  }

  render() {
    return (
      <h2>Shop Main Page</h2>
    );
  }
}

export default Shop