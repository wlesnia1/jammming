import React, { useState } from 'react';
import Track from "./Track";

function Tracklist({tracks}) {

  return (
    <ul style={{textAlign: "left"}}>
      {tracks.map((track, i) => <Track track={track}  key={track.name + "_tracklist_" + i} />)}
    </ul>
  );
}

export default Tracklist;
