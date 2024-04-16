let token;
let API_BASE_URL;
let isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

// Determine the API base URL based on the environment
if (isChromeExtension) {
    API_BASE_URL = 'https://api.spotify.com/v1';
} else {
    API_BASE_URL = 'https://api.spotify.com/v1'; // replace with your server's API URL if needed
}

document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('searchBtn');
    checkPageButton.addEventListener('click', function () {
        let songName = document.getElementById('searchInput').value;

        access_token_fetch("26ee5b6705f9463c8f441d5eb20fdc9e", "83be17423c8a499988659b0340e5e8cc");

        songIdFetch(songName)
            .then(songId => {
                console.log('Song ID:', songId);
                openNewWindowWithSongId(songId);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, false);
}, false);

function songIdFetch(songName) {
    return fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(songName)}&type=track`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch song ID');
        }
        return response.json();
    })
    .then(data => {
        if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
            return data.tracks.items[0].id;
        } else {
            throw new Error('No tracks found.');
        }
    });
}

function openNewWindowWithSongId(songId) {
    if (isChromeExtension) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let newWindow = window.open('popup.html', 'popup.html', 'width=800,height=220,menubar=1,resizable=0');

            newWindow.onload = function() {
                newWindow.postMessage({ songId: songId }, '*');
            };
        });
    } else {
        // Redirect to popup.html passing songId as a query parameter
        window.location.href = `popup.html?songId=${songId}`;
    }
}

function access_token_fetch(client_id, client_secret) {
    const authOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    };
    
    fetch('https://accounts.spotify.com/api/token', authOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch token');
            }
            return response.json();
        })
        .then(data => {
            token = data.access_token;
            console.log('Access Token:', token);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}
