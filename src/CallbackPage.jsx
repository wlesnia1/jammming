import { useEffect } from "react";

function CallbackPage() {
  const CLIENT_ID = "1cd44f9ad61f4d13b2f01407183fa3f2";
  const REDIRECT_URI = "https://wlesnia1.github.io/jammming/#/callback";
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const verifier = localStorage.getItem("spotify_code_verifier");

    if (code && verifier) {
      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI + "callback",
          client_id: CLIENT_ID,
          code_verifier: verifier
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log("Access Token:", data.access_token);
          localStorage.setItem("spotify_access_token", data.access_token);
          window.location.href = REDIRECT_URI;
        })
        .catch(console.error);
    }
  }, []);

  return <p>Handling redirect...</p>;
}

export default CallbackPage;