import React, { useState } from 'react';
import Track from "./Track";

function Playlist({tracks}) {

  return (
    <ul>
      {tracks.map((track, i) => <Track track={track} key={track.name + "_playlist_" + i}/>)}
    </ul>
  );
}

export default Playlist;
