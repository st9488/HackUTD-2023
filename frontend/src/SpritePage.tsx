import React, { Component } from 'react'

export default class SpritePage extends Component {
  render() {
    return (
      // make a board that is 16:9 resolution
      <div className="sprite-page" style={{backgroundColor: 'burlywood', height: '500px', width: '1000px', border: 'solid black'}}>
        <div style={{backgroundColor: 'black', height: '50px', width: '50px'}}></div>
      </div>
    )
  }
}