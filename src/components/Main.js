import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Scrim from './Scrim';
import Leaderboard from './Leaderboard';

class Main extends React.Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Scrim}/>
          <Route path='/leaderboard' component={Leaderboard}/>
        </Switch>
      </main>
    );
  }
}


export default Main;