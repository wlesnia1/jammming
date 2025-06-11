import React, { useState } from 'react';
import Track from "./Track";

function Tracklist({tracks, addToPlaylist}) {

  return (
    <ul style={{flexBasis: 0, flexGrow: 1}}>
      {tracks.map((track, i) => <Track track={track}  key={track.name + "_tracklist_" + i} addToPlaylistButton={true} buttonHandler={addToPlaylist} />)}
    </ul>
  );
}

export default Tracklist;
