import React from 'react';
import axios from 'axios';

class Scrim extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      scrimmers: [],
      buttonVisible: false,
      selectedIndex: 'blank',
      notSelectedIndex: 'blank',
      currentScrimmers: []
    };
  }
  
  componentDidMount() {
    this.getScrimPartners();
  }
  
  getScrimPartners(){
    axios.get('/api/scrim')
      .then(res => {
        const scrimmers = res.data.scrimArray.map(function(animal) {return animal;});
        const currentScrimmers = res.data.scrimArray.map(function(animal) {return animal._id;});
        this.setState({
          scrimmers,
          currentScrimmers
        });
      });
  }
  
  changeSelection(animalIndex) {
    var notSelectedAnimalIndex = '';
    for (var i=0; i < this.state.currentScrimmers.length; i++){
      if (this.state.currentScrimmers[i] !== animalIndex){
        notSelectedAnimalIndex = this.state.currentScrimmers[i];
      }
    }
    this.setState({
      buttonVisible: true,
      selectedIndex: animalIndex,
      notSelectedIndex: notSelectedAnimalIndex
    });
  }
  alertMessage(string){ //()=>this.alertMessage(this.state.selectedIndex)
    alert(string);
  }
  
  confirmSelection(winner, loser) {
    //TODO: calculate ELO
    axios.put('/api/animals/' + winner, {
      elo: 1000
    })
      .then(function(response) {
        return response.data;
      });
    axios.put('/api/animals/' + loser, {
      elo: 1000
    })
      .then(function(response) {
        return response.data;
      });
    this.getScrimPartners();
    this.setState({
      buttonVisible: false,
      selectedIndex: 'blank',
      notSelectedIndex: 'blank'
    });
  }
  
  render() {
    const confirmButton = 
      (this.state.buttonVisible? 
        <button className='buttonLockIn' 
          onClick={()=>this.confirmSelection(this.state.selectedIndex, this.state.notSelectedIndex)}>
        Confirm that Cutie
        </button> 
        : null);
    return (
      <div>
        <h2>
          Which is cuter?
        </h2>
        <div>
          {this.state.scrimmers.map(animal => 
            <div className={this.state.selectedIndex===animal._id ? 'scrimProfileA':'scrimProfileI'} key={animal._id} 
              onClick={()=>this.changeSelection(animal._id)}> 
              <div>Picture by {animal.author}</div>
              <div className="imgFrame">
                <span className="imgHelper"><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></span><img src={animal.url}/> {/*next-line spam to help vertical alignment because I don't know how to fix it*/}
              </div>
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