import React, { useState } from 'react';
import './App.css';

function Track({track, addToPlaylistButton, buttonHandler}) {

  return (
    <li style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem"}}>
      <div style={{margin: 0, textAlign: "left"}}>
        <p>Artist: {track.artist}</p><p>Song: {track.name}</p><p>Album: {track.album}</p>
      </div>
      {addToPlaylistButton ? <button onClick={buttonHandler} value={track.index}>+</button> : <button onClick={buttonHandler} value={track.index}>X</button>}
    </li>
  );
}

export default Track;
