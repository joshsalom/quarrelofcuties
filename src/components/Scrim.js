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
        const scrimmers = res.data.scrimArray.map(function(animal) {return animal;});
        this.setState({
          scrimmers
        });
      });
  }
  render() {
    return (
      <div>
        <h2>
          Which is the Cutest?
        </h2>
        <div>
          {this.state.scrimmers.map(animal => 
            <div className='scrimProfile' key={animal._id}> 
              <div>Picture by {animal.author}</div>
              <img src={animal.url}></img>
            </div>
          )}
        </div>
        <div className='buttonWrapper'>
          <button className='buttonLockIn'>Confirm that Cutie</button>  
        </div>
      </div>
    );
  }
}

export default Scrim;