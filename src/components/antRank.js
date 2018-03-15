import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'


class AntRank extends Component {




  render() {
    return (
      <div>
        <Button id="rank" onClick={this.props.antRank} >Rank Ants</Button>
      </div>
    );
  }
}

export default AntRank;
