import React from 'react';
import axios from 'axios';

class Scrim extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      scrimmers: [],
      buttonVisible: false,
      selectedIndex: ""
    };
    
    //this.changeSelection = this.handleClick.bind(this);
    //this.alertMessage = this.alertMessage.bind(this);
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
  
  changeSelection(animalIndex) {
    this.setState({
      buttonVisible: true,
      selectedIndex: animalIndex
      
    });
  }
  alertMessage(string){
    alert(string);
  }
  render() {
    const confirmButton = (this.state.buttonVisible? <button className='buttonLockIn' onClick={()=>this.alertMessage(this.state.selectedIndex)}>Confirm that Cutie</button> : null);
    return (
      <div>
        <h2>
          Which is the Cutest?
        </h2>
        <div>
          {this.state.scrimmers.map(animal => 
            <div className='scrimProfileI'/*{selectedIndex===animal._id ? 'scrimProfileA':'scrimProfileI'}*/ key={animal._id} 
                           onClick={()=>this.changeSelection(animal._id)}> 
              <div>Picture by {animal.author}</div>
              <img src={animal.url}></img>
            </div>
          )}
        </div>
        <div className='buttonWrapper'>
          {confirmButton}
        </div>
      </div>
    );
  }
}

export default Scrim;