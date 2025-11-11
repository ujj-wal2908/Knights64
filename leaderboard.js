// -----------------------------------------------------------------
// 1. PASTE YOUR *NEW* "FORM RESPONSES" GOOGLE SHEET LINK HERE
// -----------------------------------------------------------------
const LEADERBOARD_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeyHTUiIS_et9RPwAtHIkCt5IJo3MluqMYzAynpYLJJVxEn0fhIBrtCGvVa6Cz7dmNa2He6jcEOm3m/pub?gid=1976313506&single=true&output=csv';

// -----------------------------------------------------------------
// 2. ADD YOUR FOUR IMAGE PATHS HERE
// -----------------------------------------------------------------
// Place your 4 images in the same folder as your index.html
// and update the names here.
const defaultPhotos = [
    'https://i.postimg.cc/8CqRSjQG/Screenshot-2025-11-11-131635.png', // <-- Replace with your image name
    'https://i.postimg.cc/vxtXnw6n/Screenshot-2025-11-11-183513.png', // <-- Replace with your image name
    'https://i.postimg.cc/8fmwvgrH/Screenshot-2025-11-11-183522.png', // <-- Replace with your image name
    'https://i.postimg.cc/JH5KXCBc/Screenshot-2025-11-11-183529.png',
    'https://i.postimg.cc/MfmtBJjm/Screenshot-2025-11-11-183537.png'
];
// -----------------------------------------------------------------


// Function to parse CSV data
function parseCSV(text) {
    return text.split('\n').slice(1).map(line => {
        // Handle potential commas inside quoted values
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        
        // Trim quotes from "quoted values"
        const cleanValues = values.map(val => val.replace(/^"|"$/g, '').trim());

        // We no longer need the photo URL from the sheet
        return {
            Name: cleanValues[2] ? cleanValues[2] : '',            // Column C
            ChessUsername: cleanValues[3] ? cleanValues[3] : '',   // Column D
            Rating: cleanValues[4] ? cleanValues[4] : 'Unrated'    // Column E
        };
    });
}

// Function to fetch and process the member data
async function loadLeaderboard() {
    if (LEADERBOARD_CSV_URL === 'PASTE_YOUR_NEW_LEADERBOARD_SHEET_LINK_HERE') {
        document.getElementById('leaderboard-container').innerHTML = '<p style="color: red; text-align: center; font-weight: bold;">ERROR: You need to paste your new Leaderboard Google Sheet link into the leaderboard.js file!</p>';
        return;
    }

    try {
        const response = await fetch(LEADERBOARD_CSV_URL + '&t=' + new Date().getTime()); // Cache-bust
        const csvText = await response.text();
        const data = parseCSV(csvText);

        // Sort data by rating, highest to lowest
        data.sort((a, b) => (parseInt(b.Rating) || 0) - (parseInt(a.Rating) || 0));

        const container = document.getElementById('leaderboard-container');
        container.innerHTML = ''; // Clear "Loading..." text

        for (const member of data) {
            if (member.Name && member.ChessUsername) {
                
                // ========= THIS IS THE NEW RANDOM LOGIC =========
                // Pick a random number between 0 and 3
                const photoIndex = Math.floor(Math.random() * defaultPhotos.length);
                const photoUrl = defaultPhotos[photoIndex];
                // ================================================

                const profileLink = `https://www.chess.com/member/${member.ChessUsername}`;

                const card = document.createElement('div');
                card.className = 'profile-card';
                card.innerHTML = `
                    <img src="${photoUrl}" alt="Profile photo of ${member.Name}">
                    <div class="profile-info">
                        <h3>${member.Name}</h3>
                        <p>Rating: <strong>${member.Rating}</strong></p>
                    </div>
                    <a href="${profileLink}" class="profile-link" target="_blank" title="View ${member.ChessUsername} on Chess.com">
                        @${member.ChessUsername}
                    </a>
                `;
                container.appendChild(card);
            }
        }

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        container.innerHTML = '<p>Could not load leaderboard. Check that the Google Sheet link is correct and published.</p>';
    }
}

// Run the function when the page loads
window.addEventListener('DOMContentLoaded', loadLeaderboard);
