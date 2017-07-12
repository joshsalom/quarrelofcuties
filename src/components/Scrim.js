import React from 'react';
import axios from 'axios';

class Scrim extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      scrimmers: []
    };
  }
  
  componentDidMount() {
    axios.get('/api/scrim')
      .then(res => {
        const scrimmers = res.data.scrimList;
        this.setState({
          scrimmers
        });
      });
  }
  render() {
    return (
      <div>
      Wow!
      </div>
    );
  }
}

export default Scrim;