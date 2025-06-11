import React, { useState } from 'react';
import './App.css';

function Track({track, addToPlaylistButton, buttonHandler}) {

  return (
    <li style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
      <p style={{marginRight: "1rem", display: "inline-block"}}>Artist: {track.artist}, Song: {track.name}, Album: {track.album}</p>
      {addToPlaylistButton ? <button onClick={buttonHandler} value={track.index}>+</button> : <button onClick={buttonHandler} value={track.index}>X</button>}
    </li>
  );
}

export default Track;
