import React, { useEffect, useState } from 'react';
import './Login.css';
import SearchBar from "./SearchBar";
import Tracklist from "./Tracklist";
import Playlist from "./Playlist";

function App() {
  // TODO: hide these or change them to user inputs
  const CLIENT_ID = "1cd44f9ad61f4d13b2f01407183fa3f2";
  const REDIRECT_URI = "https://wlesnia1.github.io/jammming/#/";
  const SCOPES = ["user-read-private", "playlist-modify-private"];
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userId, setUserId] = useState(null);
  const [searchTracks, setSearchTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (localStorage.getItem("spotify_access_token")) {
      setAuth(localStorage.getItem("spotify_access_token"));
    }
  }, []);

  useEffect(() => {
    if (auth) {
      fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json"
        },
        method: "GET"
      }).then(response => {
        if (!response.ok) {
          if (response.status !== 401) {// auth token expired or doesn't exist; no need to throw an error
            throw new Error("API response status: " + response.status + "; statusText: " + response.statusText);
          }
        }
        return response.json();
      }).then(json => {
        setUserId(json.id);
        setError(null);
        setLoading(false);
      }).catch(err => {
        setError(err.message);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [auth]);

  
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  const handleLogin = async () => {
    const state = generateRandomString(16);
    const codeVerifier = generateRandomString(64);

    // Save code verifier in localStorage
    localStorage.setItem("spotify_code_verifier", codeVerifier);

    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);

    const authURL = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES.join(" "))}&redirect_uri=${encodeURIComponent(REDIRECT_URI + "callback")}&code_challenge_method=S256&code_challenge=${codeChallenge}&state=${state}`;

    window.location.href = authURL;
  };

  function onSearchInput(e) {
    setSearchInput(e.target.value);
  }

  function search(e) {
    e.preventDefault();
    if (auth) {
      fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&limit=10`, {
        headers: {
          Authorization: `Bearer ${auth}`,
          "Content-Type": "application/json"
        },
        method: "GET"
      }).then(response => {
        if(!response.ok) {
          throw new Error("API response status: " + response.status + "; statusText: " + response.statusText);
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
              index,
              uri: track.uri
            });
            index++;
          }
        }
        setError(null);
        setSearchTracks(trackz);
      }).catch(err => {
        setError(err.message);
      });
    }
  }

  function addToPlaylist(e) {
    // a bit clunky but assigning playlistTrack = searchTracks[e.target.value] causes issues (shallow copy vs. deep copy)
    // also need playlistTracks to have their own indices; since playlistTracks could add index 0 of searchTracks multiple times
    let playlistTrack = {
      name: searchTracks[e.target.value].name,
      artist: searchTracks[e.target.value].artist,
      album: searchTracks[e.target.value].album,
      index: playlistTracks.length,
      uri: searchTracks[e.target.value].uri
    };
    setPlaylistTracks([...playlistTracks, playlistTrack]);
  }

  function removeFromPlaylist(e) {
    setPlaylistTracks([...playlistTracks.filter(track => track.index != e.target.value)]);
  }

  function onClickHandlerSave() {
    if (!document.getElementById("playlistTitle").value) {
      alert("Playlist must have a title");
    } else if (playlistTracks.length === 0) { //should be unreachable since Save button is hidden with an empty playlist, but eh
      alert("Playlist must have at least one song in it");
    } else {
      fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`, {
        body: JSON.stringify({
          name: document.getElementById("playlistTitle").value,
          description: "", //TODO: add user input for description
          public: false
        }),
        headers: {
          Authorization: `Bearer ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST"
      }).then(response => {
        if(!response.ok) {
          throw new Error("API response status: " + response.status + "; statusText: " + response.statusText);
        }
        return response.json();
      }).then(json => {
        const playlistId = json.id
        const playlistURIs = [];
        //add tracks
        for (const song of playlistTracks) {
          playlistURIs.push(song.uri);
        }
        fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`, {
          body: JSON.stringify({
            uris: playlistURIs,
            position: 0
          }),
          headers: {
            Authorization: `Bearer ${auth}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST"
        }).then(response => {
          if(!response.ok) {
            throw new Error("API response status: " + response.status + "; statusText: " + response.statusText);
          }
        }).catch(err => {
          setError(err.message);
        });
      }).catch(err => {
        setError(err.message);
      });
    }
  }

  if (loading) return <h1>Loading...</h1>;


  return (
    <div id="appBlock">
      {error && (<h1>Error: {error}</h1>)}
      {!userId && (
        <div id="loginButton">
          <button onClick={handleLogin}>Login to Spotify</button>
        </div>
      )}
      {userId && (<SearchBar searchInput={searchInput} onSubmitHandler={search} onChangeHandler={onSearchInput} />)}
      {searchTracks.length >= 1 && (
        <>
        <div style={{display: "flex", alignItems: "center"}}>
          <h2 style={{flexBasis: 0, flexGrow: 1}}>Search Results</h2>
          <h2 style={{flexBasis: 0, flexGrow: 1}}>Playlist Title: <input type="text" maxLength="30" style={{height: "60%", width: "10rem"}} id="playlistTitle" /></h2>
        </div>
        <div style={{display: "flex"}}>
          <Tracklist tracks={searchTracks} addToPlaylist={addToPlaylist} />
          <Playlist tracks={playlistTracks} removeFromPlaylist={removeFromPlaylist}/>
        </div>
        </>
      )}
      {playlistTracks.length >= 1 && (<button type="button" onClick={onClickHandlerSave} id="saveButton">Save to Spotify</button>)}
    </div>
  );
}

export default App;
