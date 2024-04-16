// Get the iframe element
var spotifyPlayer = document.getElementById('spotifyPlayer');

// Function to replace {song_id} placeholder in the src attribute
function replaceSongId(songId) {
    spotifyPlayer.src = `https://open.spotify.com/embed/track/${songId}?utm_source=generator`;
}

// Extract songId from URL query parameter
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Get songId from URL and replace in iframe src
var songId = getParameterByName('songId');
if (songId) {
    replaceSongId(songId);
    console.log('Song ID:', songId);
}
// Listen for messages from the parent window
window.addEventListener('message', function (event) {
    // Check if the message contains a songId
    if (event.data && event.data.songId) {
        // Replace the {song_id} placeholder with the actual songId
        replaceSongId(event.data.songId);
        console.log('Song ID:', event.data.songId);
    }
});
