import React, { useState } from 'react';
import Track from "./Track";

function Playlist({tracks, removeFromPlaylist}) {

  return (
    <ul style={{flexBasis: 0, flexGrow: 1}}>
      {tracks.map((track, i) => <Track track={track} key={track.name + "_playlist_" + i} addToPlaylistButton={false} buttonHandler={removeFromPlaylist}/>)}
    </ul>
  );
}

export default Playlist;
