import React, { useState } from 'react';

function Track({track}) {

  return (
    <li>Artist: {track.artist}, Song: {track.name}</li>
  );
}

export default Track;
