import React, { useState } from 'react';
import Tracklist from './Tracklist';

function SearchResults({tracks}) {
  return (
    <Tracklist tracks={tracks} />
  );
}

export default SearchResults;
