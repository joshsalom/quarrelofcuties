import React from 'react';
import Header from './Header';
import Main from './Main';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <Main />
        </div>
      </div>
    );
  }
}


export default App;