import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBar from "./SearchBar";
import Tracklist from "./Tracklist";
import Playlist from "./Playlist";

function App() {

  const spotifyClientID = "1cd44f9ad61f4d13b2f01407183fa3f2";
  const spotifySecret = "79cf5160128747c4a7d9b2e1ac39808e";

  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTracks, setSearchTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetch("https://accounts.spotify.com/api/token", {
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: spotifyClientID,
        client_secret: spotifySecret
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    }).then(response => {
      if(!response.ok) {
        setError("Authorization failed");
        setLoading(false);
      }
      return response.json();
    }).then(json => {
      setAuth(json);
      setLoading(false);
    }).catch(err => {
      setError(err);
      setLoading(false);
    });
  },[]);

  function onSearchInput(e) {
    setSearchInput(e.target.value);
  }

  function search(e) {
    e.preventDefault();
    if (auth.access_token) {
      fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track`, {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
          "Content-Type": "application/json"
        },
        method: "GET"
      }).then(response => {
        if(!response.ok) {
          setError("Search failed");
        }
        return response.json();
      }).then(json => {
        console.log(json);
        let trackz = [];
        let index = 0; // necessary for child components to know what to add/remove from tracklist/playlist
        for (const track of json.tracks.items) {
          for (const artist of track.artists) {
            trackz.push({
              name: track.name,
              artist: artist.name,
              album: track.album.name,
              index
            });
            index++;
          }
        }
        setSearchTracks(trackz)
      }).catch(err => {
        setError(err);
      });
    }
  }

  function addToPlaylist(e) {
    // a bit clunky but assigning playlistTrack = searchTracks[e.target.value] causes issues (shallow copy vs. the below deep copy)
    // also need playlistTracks to have their own indices; since playlistTracks could add index 0 of searchTracks multiple times
    let playlistTrack = {
      name: searchTracks[e.target.value].name,
      artist: searchTracks[e.target.value].artist,
      album: searchTracks[e.target.value].album,
      index: playlistTracks.length
    };
    setPlaylistTracks([...playlistTracks, playlistTrack]);
  }

  function removeFromPlaylist(e) {
    setPlaylistTracks([...playlistTracks.filter(track => track.index != e.target.value)]);
  }

  if (loading) return <h1>Loading...</h1>;
  if (error) return <><h1>Error: {error}</h1></>;


  return (
    <div>
      <SearchBar searchInput={searchInput} onSubmitHandler={search} onChangeHandler={onSearchInput} />
      <div style={{display: "flex"}}>
        <Tracklist tracks={searchTracks} addToPlaylist={addToPlaylist} />
        <Playlist tracks={playlistTracks} removeFromPlaylist={removeFromPlaylist}/>
      </div>
      <button type="button">Save to Spotify</button>
    </div>
  );
}

export default App;
