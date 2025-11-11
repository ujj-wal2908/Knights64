// -----------------------------------------------------------------
// 1. PASTE YOUR *NEW* "WINNERS" GOOGLE SHEET LINK HERE
// -----------------------------------------------------------------
const WINNERS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSvBlW7nF8fSeNrCpUMCKMfqY3ucFVKiZ8Mg-YHQR5Q6kgiKHndxZPTvaUb3tV0U2WZ-i46kekkDBkJ/pub?output=csv';

// -----------------------------------------------------------------
// 2. PASTE YOUR *DEFAULT PAWN IMAGE* LINK HERE
// -----------------------------------------------------------------
// Get the "Direct Link" from PostImages for your default pawn.
const DEFAULT_PAWN_IMAGE_URL = 'https://i.postimg.cc/8CqRSjQG/Screenshot-2025-11-11-131635.png';
// -----------------------------------------------------------------


// Function to parse CSV data
function parseCSV(text) {
    return text.split('\n').slice(1).map(line => {
        const values = line.split(',');
        return {
            EventDate: values[0] ? values[0].trim() : '',
            EventName: values[1] ? values[1].trim() : '',
            WinnerName: values[2] ? values[2].trim() : '',
            WinnerImageUrl: values[3] ? values[3].trim() : '' // <-- NEW
        };
    });
}

// Function to fetch and process the winner data
async function loadWinners() {
    if (WINNERS_CSV_URL === 'PASTE_YOUR_WINNERS_SHEET_LINK_HERE' || DEFAULT_PAWN_IMAGE_URL === 'PASTE_YOUR_DEFAULT_PAWN_IMAGE_LINK_HERE') {
        document.getElementById('winners-container').innerHTML = '<p style="color: red; text-align: center; font-weight: bold;">ERROR: You need to paste your new links into the winners.js file!</p>';
        return;
    }

    try {
        const response = await fetch(WINNERS_CSV_URL + '&t=' + new Date().getTime()); // Cache-bust
        const csvText = await response.text();
        const data = parseCSV(csvText);

        // Group winners by event
        const groupedEvents = {};
        for (const row of data) {
            if (!row.EventDate || !row.EventName || !row.WinnerName) continue;

            const key = row.EventDate + row.EventName;
            if (!groupedEvents[key]) {
                groupedEvents[key] = {
                    date: row.EventDate,
                    name: row.EventName,
                    imageUrl: '', // Start blank
                    winners: []
                };
            }
            // If this row has an image URL and we haven't found one yet, use it
            if (row.WinnerImageUrl && !groupedEvents[key].imageUrl) {
                groupedEvents[key].imageUrl = row.WinnerImageUrl;
            }
            groupedEvents[key].winners.push(row.WinnerName);
        }

        // Sort events by date, newest first
        const sortedEvents = Object.values(groupedEvents).sort((a, b) => new Date(b.date) - new Date(a.date));

        const container = document.getElementById('winners-container');
        container.innerHTML = ''; // Clear "Loading..." text

        // Loop through the sorted, grouped events and build the HTML
        for (const event of sortedEvents) {
            const card = document.createElement('div');
            card.className = 'winner-event-card';

            // NEW: Logic to select the correct image
            const imageUrl = event.imageUrl || DEFAULT_PAWN_IMAGE_URL;

            // Create the list of winners (e.g., "Param & SS")
            const winnerList = event.winners.join(' & ');

            // NEW: Updated HTML to include the image
            card.innerHTML = `
                <img src="${imageUrl}" alt="Event image">
                <div class="winner-info">
                    <h3>${event.name}</h3>
                    <p class="winner-date">${event.date}</p>
                    <div class="winner-names">
                        <strong>🏆 ${winnerList}</strong>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }

    } catch (error) {
        console.error('Error fetching winners:', error);
        container.innerHTML = '<p>Could not load winners. Check that the Google Sheet link is correct and published.</p>';
    }
}

// Run the function when the page loads
window.addEventListener('DOMContentLoaded', loadWinners);
