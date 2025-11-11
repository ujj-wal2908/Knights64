// -----------------------------------------------------------------
// 1. PASTE YOUR *NEW* LEADERBOARD GOOGLE SHEET LINK HERE
// -----------------------------------------------------------------
const LEADERBOARD_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeyHTUiIS_et9RPwAtHIkCt5IJo3MluqMYzAynpYLJJVxEn0fhIBrtCGvVa6Cz7dmNa2He6jcEOm3m/pub?output=csv';
// -----------------------------------------------------------------


// Function to parse CSV data
function parseCSV(text) {
    return text.split('\n').slice(1).map(line => {
        const values = line.split(',');
        return {
            Name: values[0] ? values[0].trim() : '',
            ChessUsername: values[1] ? values[1].trim() : '',
            Rating: values[2] ? values[2].trim() : 'Unrated',
            ProfilePhotoUrl: values[3] ? values[3].trim() : ''
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
                // Use a default icon if no photo is provided
                const photoUrl = member.ProfilePhotoUrl || 'https://images.chesscomfiles.com/uploads/v2/images_users/less_files/300x300/default_light.png';
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
