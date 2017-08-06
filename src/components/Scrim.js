import React from 'react';
import axios from 'axios';

class Scrim extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      scrimmers: [],
      buttonVisible: false,
      selectedAnimalObj: {},
      notSelectedAnimalObj: {}
      //currentScrimmers: []
    };
  }
  
  componentDidMount() {
    this.getScrimPartners();
  }
  
  getScrimPartners(){
    axios.get('/api/scrim')
      .then(res => {
        const scrimmers = res.data.scrimArray.map(function(animal) {return animal;});
        //const currentScrimmers = res.data.scrimArray.map(function(animal) {return animal._id;});  //might not be used
        this.setState({
          scrimmers
          //currentScrimmers
        });
      });
  }
  
  changeSelection(animalObj) {
    var thisNotSelectedAnimalObj = '';
    for (var i=0; i < this.state.scrimmers.length; i++){
      if (this.state.scrimmers[i]._id !== animalObj._id){
        thisNotSelectedAnimalObj = this.state.scrimmers[i];
      }
    }
    this.setState({
      buttonVisible: true,
      selectedAnimalObj: animalObj,
      notSelectedAnimalObj: thisNotSelectedAnimalObj
    });
  }
  alertMessage(string){ //()=>this.alertMessage(this.state.selectedIndex)
    alert(string);
  }
  
  confirmSelection(winner, loser) {
    //TODO: calculate ELO
    var kFactor = 32;
    
    var winnerR = Math.pow(10, (winner.elo/400));
    var loserR = Math.pow(10, (loser.elo/400));
    
    var winnerE = winnerR/(winnerR + loserR);
    var loserE = loserR/(winnerR + loserR);
    
    var winnerNewElo = winner.elo + kFactor*(1-winnerE);
    var loserNewElo = loser.elo + kFactor*(0-loserE);
    
    axios.put('/api/animals/' + winner._id, {
      elo: winnerNewElo
    })
      .then(function(response) {
        return response.data;
      });
    axios.put('/api/animals/' + loser._id, {
      elo: loserNewElo
    })
      .then(function(response) {
        return response.data;
      });
    this.getScrimPartners();
    this.setState({
      buttonVisible: false,
      selectedAnimalObj: {},
      notSelectedAnimalObj: {}
    });
  }
  
  render() {
    const confirmButton = 
      (this.state.buttonVisible? 
        <button className='buttonLockIn' 
          onClick={()=>this.confirmSelection(this.state.selectedAnimalObj, this.state.notSelectedAnimalObj)}>
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
            <div className={this.state.selectedAnimalObj._id===animal._id ? 'scrimProfileA':'scrimProfileI'} key={animal._id} 
              onClick={()=>this.changeSelection(animal)}> 
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