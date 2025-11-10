// -----------------------------------------------------------------
// 1. PASTE YOUR GOOGLE SHEET PUBLISHED LINK HERE
// -----------------------------------------------------------------
// Go to File > Share > Publish to web.
// Select "Entire Document" and "Comma-separated values (.csv)".
// Click Publish and paste the generated link below.
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTrLBDMrXURtzNzTdN2ic-pKNC928d3ziwlA6IfpCHH2-0Co5i3tV0hPLgUXnirXapMelYQVHLw-lyv/pub?output=csv';
// -----------------------------------------------------------------


// Function to parse CSV data (simple parser for this specific use)
function parseCSV(text) {
    return text.split('\n').slice(1).map(line => {
        const values = line.split(',');
        return {
            ImageUrl: values[0] ? values[0].trim() : '',
            SubmitterName: values[1] ? values[1].trim() : '',
            IsWinner: values[2] ? values[2].trim().toUpperCase() : ''
        };
    });
}

// Function to fetch and process the data
async function loadMemes() {
    // Check if the link has been changed
    if (GOOGLE_SHEET_CSV_URL === 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTrLBDMrXURtzNzTdN2ic-pKNC928d3ziwlA6IfpCHH2-0Co5i3tV0hPLgUXnirXapMelYQVHLw-lyv/pub?output=csv') {
        document.getElementById('meme-of-the-week').innerHTML = '<p style="color: red; text-align: center; font-weight: bold;">ERROR: You need to paste your Google Sheet link into the script.js file!</p>';
        return;
    }

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const csvText = await response.text();
        const data = parseCSV(csvText);

        const winnerCard = document.getElementById('winner-card');
        const gallery = document.getElementById('meme-gallery');

        // Clear default content
        winnerCard.innerHTML = '<p>Loading winner...</p>';
        gallery.innerHTML = '<p>Loading gallery...</p>';
        
        // Find the winner first
        const winner = data.find(row => row.IsWinner === 'TRUE');
        
        if (winner && winner.ImageUrl) {
            winnerCard.innerHTML = `
                <img src="${winner.ImageUrl}" alt="Meme by ${winner.SubmitterName}">
                <h3>Submitted by: ${winner.SubmitterName}</h3>
            `;
        } else {
            winnerCard.innerHTML = '<p>This week\'s winner is yet to be decided!</p>';
        }

        // Clear gallery to add other memes
        gallery.innerHTML = ''; 

        // Loop through all rows
        for (const row of data) {
            // Add to gallery ONLY if they are not the winner and have a valid URL
            if (row.ImageUrl && row.IsWinner !== 'TRUE') {
                const card = document.createElement('div');
                card.className = 'meme-card';
                card.innerHTML = `
                    <img src="${row.ImageUrl}" alt="Meme by ${row.SubmitterName}">
                    <p>Submitted by: ${row.SubmitterName}</p>
                `;
                gallery.appendChild(card);
            }
        }

    } catch (error) {
        console.error('Error fetching memes:', error);
        document.getElementById('meme-of-the-week').innerHTML = '<p>Could not load memes. Check that the Google Sheet link is correct and published.</p>';
    }
}

// Run the function when the page loads
window.addEventListener('DOMContentLoaded', loadMemes);
