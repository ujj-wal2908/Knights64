// -----------------------------------------------------------------
// 1. PASTE YOUR *NEW* "FORM RESPONSES" GOOGLE SHEET LINK HERE
// -----------------------------------------------------------------
const LEADERBOARD_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeyHTUiIS_et9RPwAtHIkCt5IJo3MluqMYzAynpYLJJVxEn0fhIBrtCGvVa6Cz7dmNa2He6jcEOm3m/pub?gid=1976313506&single=true&output=csv';
// -----------------------------------------------------------------


// Function to parse CSV data
function parseCSV(text) {
    return text.split('\n').slice(1).map(line => {
        // Handle potential commas inside quoted values
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        
        // Trim quotes from "quoted values"
        const cleanValues = values.map(val => val.replace(/^"|"$/g, '').trim());

        // === THIS IS THE UPDATED SECTION ===
        // We are now using the correct column numbers from the form
        return {
            Name: cleanValues[2] ? cleanValues[2] : '',            
            ChessUsername: cleanValues[3] ? cleanValues[3] : '',   
            Rating: cleanValues[4] ? cleanValues[4] : 'Unrated',   
            ProfilePhotoUrl: cleanValues[5] ? cleanValues[5] : '' 
        };
        // ===================================
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
                const photoUrl = member.ProfilePhotoUrl || 'https://i.postimg.cc/FRxxYV0s/Screenshot-2025-11-11-131635.png';
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
