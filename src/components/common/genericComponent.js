import React from 'react';


class GenericComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      dto: null,
      alert: null,
      showModal: false,
    };
  }

  async findAll() {
    const response = await this.api.findAll();
    if (!response.error) {
      this.setState({ error: false, isLoaded: true, currentView: 'list', dto: response.result});
    } else {
      this.setState({ error: true, isLoaded: true, currentView: 'list', dto: response.result });
    } 
  }

  async findById(id) {
    const response = await this.api.findById(id);
    if (!response.error) {
      this.setState({ error: false, isLoaded: true, currentView: 'single', dto: response.result});
    } else {
      this.setState({ error: true, isLoaded: true, currentView: 'single', dto: response.result });
    }
  }

  async getBaseDto() {
    const response = await this.api.getBaseDto();
    if (!response.error) {
      this.setState({ error: false, isLoaded: true, currentView: 'single', dto: response.result});
    } else {
      this.setState({ error: true, isLoaded: true, currentView: 'single', dto: response.result });
    }
  }

}
  
  export default GenericComponent