import React from 'react';
import axios from 'axios';
//import css

class Leaderboard extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      rankArray: []
    };
  }
  
  componentDidMount() {
    this.getRankings();
  }
  
  getRankings(){
    axios.get('/api/rankings')
      .then(res => {
        const rankArray = res.data.rankArray.map(function(animal) {return animal;});
        this.setState({
          rankArray
        });
      });
  }
  
  render() {
    return (
      <ul>
        {this.state.rankArray.map(animal =>
          <li key={animal._id}>
            <img src={animal.thumbnail}/><br/>
            Redditor: {animal.author}<br/>
            Reddit Score: {animal.score}<br/>
            Elo: {animal.elo}<br/>
          </li>
        )}
      </ul>
    );
  }
}

export default Leaderboard;