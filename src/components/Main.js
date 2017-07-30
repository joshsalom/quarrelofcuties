import React from 'react';
import Scrim from './Scrim';
import Leaderboard from './Leaderboard';

class Main extends React.Component {
  render() {
    return (
      <div className='container'>
        <Scrim/>
        {/*<Leaderboard/>*/}
      </div>
    );
  }
}

export default Main;