import React, { Component } from 'react'
import Character from './components/Character'

export default class SpritePage extends Component {
  render() {
    return (
      // make a board that is 16:9 resolution
      <div className="sprite-page" style={{backgroundColor: 'burlywood', height: '500px', width: '1000px', border: 'solid black', position: 'relative'}}>
        <Character name="User" sprite={"hi"} startX={0} startY={0}/>
      </div>
    )
  }
}