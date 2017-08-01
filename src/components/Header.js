import React from 'react';
import {Link} from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <ul className="navbar">
        <li><Link to='/'>Scrim</Link></li>
        <li><Link to='/leaderboard'>Leaderboard</Link></li>
      </ul>
    );
  }
}


export default Header;