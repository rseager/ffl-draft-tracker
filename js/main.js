const mainFileInput = document.getElementById('csv-file');
const rookieFileInput = document.getElementById('rookie-csv-file');
const draftInput = document.getElementById('draft-player-input');
const draftButton = document.getElementById('draft-player-button');
const playerTable = document.getElementById('player-table');
const playerTableBody = document.querySelector('#player-table tbody');
const statusMessage = document.getElementById('status-message');
const autocompleteResults = document.getElementById('autocomplete-results');
const filterButtons = document.querySelectorAll('.filter-button');
const depthChartDiv = document.getElementById('depth-chart-view');
const modalOverlay = document.getElementById('draft-modal-overlay');
const modalPlayerName = document.getElementById('modal-player-name');
const draftMyTeamBtn = document.getElementById('draft-my-team-btn');
const draftOtherTeamBtn = document.getElementById('draft-other-team-btn');
const teamRosterView = document.getElementById('team-roster-view');
const clearDataBtn = document.getElementById('clear-data-btn');
const localStorageKey = 'fflDraftData';
const localStorageRookiesKey = 'rookieNames';
const localStorageRosterKey = 'myTeamRoster';

let allPlayers = [];
let rookieNames = [];
let myTeamRoster = {
    'QB': [], 'RB': [], 'WR': [], 'TE': [], 'FLEX': [], 'K': [], 'DST': [], 'BN': []
};
const rosterSpots = {
    'QB': 1, 'RB': 2, 'WR': 2, 'TE': 1, 'FLEX': 1, 'K': 1, 'DST': 1, 'BN': 6
};

const depthChartData = {
    "ARI": [
      { position: 'Running Backs', starter: 'James Conner', handcuff: 'Trey Benson' },
      { position: 'Wide Receivers', starter: 'Marvin Harrison Jr.', handcuff: 'Michael Wilson' },
      { position: 'Tight Ends', starter: 'Trey McBride', handcuff: 'Elijah Higgins' },
    ],
    "ATL": [
      { position: 'Running Backs', starter: 'Bijan Robinson', handcuff: 'Tyler Allgeier' },
      { position: 'Wide Receivers', starter: 'Drake London', handcuff: 'Darnell Mooney' },
      { position: 'Tight Ends', starter: 'Kyle Pitts Sr.', handcuff: 'Charlie Woerner' },
    ],
    "BAL": [
      { position: 'Running Backs', starter: 'Derrick Henry', handcuff: 'Keaton Mitchell' },
      { position: 'Wide Receivers', starter: 'Zay Flowers', handcuff: 'Rashod Bateman' },
      { position: 'Tight Ends', starter: 'Mark Andrews', handcuff: 'Isaiah Likely' },
    ],
    "BUF": [
      { position: 'Running Backs', starter: 'James Cook', handcuff: 'Ray Davis' },
      { position: 'Wide Receivers', starter: 'Keon Coleman', handcuff: 'Khalil Shakir' },
      { position: 'Tight Ends', starter: 'Dalton Kincaid', handcuff: 'Dawson Knox' },
    ],
    "CAR": [
      { position: 'Running Backs', starter: 'Chuba Hubbard', handcuff: 'Rico Dowdle' },
      { position: 'Wide Receivers', starter: 'Tetairoa McMillan', handcuff: 'Xavier Legette' },
      { position: 'Tight Ends', starter: 'Ja\'Tavion Sanders', handcuff: 'Tommy Tremble' },
    ],
    "CHI": [
      { position: 'Running Backs', starter: 'D\'Andre Swift', handcuff: 'Roschon Johnson' },
      { position: 'Wide Receivers', starter: 'DJ Moore', handcuff: 'Rome Odunze' },
      { position: 'Tight Ends', starter: 'Colston Loveland', handcuff: 'Cole Kmet' },
    ],
    "CIN": [
      { position: 'Running Backs', starter: 'Chase Brown', handcuff: 'Tahj Brooks' },
      { position: 'Wide Receivers', starter: 'Ja\'Marr Chase', handcuff: 'Tee Higgins' },
      { position: 'Tight Ends', starter: 'Mike Gesicki', handcuff: 'Noah Fant' },
    ],
    "CLE": [
      { position: 'Running Backs', starter: 'Quinshon Judkins', handcuff: 'Dylan Sampson' },
      { position: 'Wide Receivers', starter: 'Jerry Jeudy', handcuff: 'Cedric Tillman' },
      { position: 'Tight Ends', starter: 'David Njoku', handcuff: 'Harold Fannin Jr.' },
    ],
    "DAL": [
      { position: 'Running Backs', starter: 'Javonte Williams', handcuff: 'Jaydon Blue' },
      { position: 'Wide Receivers', starter: 'CeeDee Lamb', handcuff: 'George Pickens' },
      { position: 'Tight Ends', starter: 'Jake Ferguson', handcuff: 'Luke Schoonmaker' },
    ],
    "DEN": [
      { position: 'Running Backs', starter: 'RJ Harvey', handcuff: 'J.K. Dobbins' },
      { position: 'Wide Receivers', starter: 'Courtland Sutton', handcuff: 'Marvin Mims Jr.' },
      { position: 'Tight Ends', starter: 'Evan Engram', handcuff: 'Adam Trautman' },
    ],
    "DET": [
      { position: 'Running Backs', starter: 'Jahmyr Gibbs', handcuff: 'David Montgomery' },
      { position: 'Wide Receivers', starter: 'Amon-Ra St. Brown', handcuff: 'Jameson Williams' },
      { position: 'Tight Ends', starter: 'Sam LaPorta', handcuff: 'Brock Wright' },
    ],
    "GB": [
      { position: 'Running Backs', starter: 'Josh Jacobs', handcuff: 'MarShawn Lloyd' },
      { position: 'Wide Receivers', starter: 'Matthew Golden', handcuff: 'Jayden Reed' },
      { position: 'Tight Ends', starter: 'Tucker Kraft', handcuff: 'Luke Musgrave' },
    ],
    "HOU": [
      { position: 'Running Backs', starter: 'Nick Chubb', handcuff: 'Joe Mixon' },
      { position: 'Wide Receivers', starter: 'Nico Collins', handcuff: 'Christian Kirk' },
      { position: 'Tight Ends', starter: 'Dalton Schultz', handcuff: 'Cade Stover' },
    ],
    "IND": [
      { position: 'Running Backs', starter: 'Jonathan Taylor', handcuff: 'DJ Giddens' },
      { position: 'Wide Receivers', starter: 'Josh Downs', handcuff: 'Michael Pittman Jr.' },
      { position: 'Tight Ends', starter: 'Tyler Warren', handcuff: 'Mo Alie-Cox' },
    ],
    "JAC": [
      { position: 'Running Backs', starter: 'Travis Etienne Jr.', handcuff: 'Tank Bigsby' },
      { position: 'Wide Receivers', starter: 'Brian Thomas Jr.', handcuff: 'Travis Hunter' },
      { position: 'Tight Ends', starter: 'Brenton Strange', handcuff: 'Johnny Mundt' },
    ],
    "KC": [
      { position: 'Running Backs', starter: 'Isiah Pacheco', handcuff: 'Kareem Hunt' },
      { position: 'Wide Receivers', starter: 'Xavier Worthy', handcuff: 'Rashee Rice' },
      { position: 'Tight Ends', starter: 'Travis Kelce', handcuff: 'Noah Gray' },
    ],
    "LAC": [
      { position: 'Running Backs', starter: 'Omarion Hampton', handcuff: 'Najee Harris' },
      { position: 'Wide Receivers', starter: 'Ladd McConkey', handcuff: 'Tre\' Harris' },
      { position: 'Tight Ends', starter: 'Oronde Gadsden II', handcuff: 'Will Dissly' },
    ],
    "LAR": [
      { position: 'Running Backs', starter: 'Kyren Williams', handcuff: 'Blake Corum' },
      { position: 'Wide Receivers', starter: 'Puka Nacua', handcuff: 'Davante Adams' },
      { position: 'Tight Ends', starter: 'Terrance Ferguson', handcuff: 'Tyler Higbee' },
    ],
    "LV": [
      { position: 'Running Backs', starter: 'Ashton Jeanty', handcuff: 'Raheem Mostert' },
      { position: 'Wide Receivers', starter: 'Jakobi Meyers', handcuff: 'Jack Bech' },
      { position: 'Tight Ends', starter: 'Brock Bowers', handcuff: 'Michael Mayer' },
    ],
    "MIA": [
      { position: 'Running Backs', starter: 'De\'Von Achane', handcuff: 'Jaylen Wright' },
      { position: 'Wide Receivers', starter: 'Tyreek Hill', handcuff: 'Jaylen Waddle' },
      { position: 'Tight Ends', starter: 'Darren Waller', handcuff: 'Julian Hill' },
    ],
    "MIN": [
      { position: 'Running Backs', starter: 'Aaron Jones Sr.', handcuff: 'Jordan Mason' },
      { position: 'Wide Receivers', starter: 'Justin Jefferson', handcuff: 'Jordan Addison' },
      { position: 'Tight Ends', starter: 'T.J. Hockenson', handcuff: 'Josh Oliver' },
    ],
    "NE": [
      { position: 'Running Backs', starter: 'TreVeyon Henderson', handcuff: 'Rhamondre Stevenson' },
      { position: 'Wide Receivers', starter: 'Stefon Diggs', handcuff: 'Kyle Williams' },
      { position: 'Tight Ends', starter: 'Hunter Henry', handcuff: 'Austin Hooper' },
    ],
    "NO": [
      { position: 'Running Backs', starter: 'Alvin Kamara', handcuff: 'Kendre Miller' },
      { position: 'Wide Receivers', starter: 'Chris Olave', handcuff: 'Rashid Shaheed' },
      { position: 'Tight Ends', starter: 'Juwan Johnson', handcuff: 'Taysom Hill' },
    ],
    "NYG": [
      { position: 'Running Backs', starter: 'Tyrone Tracy Jr.', handcuff: 'Cam Skattebo' },
      { position: 'Wide Receivers', starter: 'Malik Nabers', handcuff: 'Wan\'Dale Robinson' },
      { position: 'Tight Ends', starter: 'Theo Johnson', handcuff: 'Daniel Bellinger' },
    ],
    "NYJ": [
      { position: 'Running Backs', starter: 'Breece Hall', handcuff: 'Braelon Allen' },
      { position: 'Wide Receivers', starter: 'Garrett Wilson', handcuff: 'Josh Reynolds' },
      { position: 'Tight Ends', starter: 'Mason Taylor', handcuff: 'Jeremy Ruckert' },
    ],
    "PHI": [
      { position: 'Running Backs', starter: 'Saquon Barkley', handcuff: 'Will Shipley' },
      { position: 'Wide Receivers', starter: 'A.J. Brown', handcuff: 'DeVonta Smith' },
      { position: 'Tight Ends', starter: 'Dallas Goedert', handcuff: 'Grant Calcaterra' },
    ],
    "PIT": [
      { position: 'Running Backs', starter: 'Kaleb Johnson', handcuff: 'Jaylen Warren' },
      { position: 'Wide Receivers', starter: 'DK Metcalf', handcuff: 'Calvin Austin III' },
      { position: 'Tight Ends', starter: 'Jonnu Smith', handcuff: 'Pat Freiermuth' },
    ],
    "SEA": [
      { position: 'Running Backs', starter: 'Kenneth Walker III', handcuff: 'Zach Charbonnet' },
      { position: 'Wide Receivers', starter: 'Jaxon Smith-Njigba', handcuff: 'Cooper Kupp' },
      { position: 'Tight Ends', starter: 'Elijah Arroyo', handcuff: 'AJ Barner' },
    ],
    "SF": [
      { position: 'Running Backs', starter: 'Christian McCaffrey', handcuff: 'Brian Robinson Jr.' },
      { position: 'Wide Receivers', starter: 'Ricky Pearsall', handcuff: 'Jauan Jennings' },
      { position: 'Tight Ends', starter: 'George Kittle', handcuff: 'Luke Farrell' },
    ],
    "TB": [
      { position: 'Running Backs', starter: 'Bucky Irving', handcuff: 'Rachaad White' },
      { position: 'Wide Receivers', starter: 'Mike Evans', handcuff: 'Emeka Egbuka' },
      { position: 'Tight Ends', starter: 'Cade Otton', handcuff: 'Payne Durham' },
    ],
    "TEN": [
      { position: 'Running Backs', starter: 'Tony Pollard', handcuff: 'Tyjae Spears' },
      { position: 'Wide Receivers', starter: 'Calvin Ridley', handcuff: 'Elic Ayomanor' },
      { position: 'Tight Ends', starter: 'Chig Okonkwo', handcuff: 'Gunnar Helm' },
    ],
    "WAS": [
      { position: 'Running Backs', starter: 'Jacory Croskey-Merritt', handcuff: 'Austin Ekeler' },
      { position: 'Wide Receivers', starter: 'Terry McLaurin', handcuff: 'Deebo Samuel Sr.' },
      { position: 'Tight Ends', starter: 'Zach Ertz', handcuff: 'Ben Sinnott' },
    ],
  };

// --- Core Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    statusMessage.textContent = 'Checking for saved data...';
    rookieNames = loadFromLocalStorage(localStorageRookiesKey) || [];

    const storedPlayers = loadFromLocalStorage(localStorageKey);
    const storedRoster = loadFromLocalStorage(localStorageRosterKey);
    
    if (storedPlayers && storedPlayers.length > 0) {
        allPlayers = storedPlayers;
        updateRookieStatus();
        displayPlayers(allPlayers);
        statusMessage.textContent = 'Data loaded from local storage.';
    } else {
        statusMessage.textContent = 'No main rankings data found. Please select a CSV file to begin.';
    }
    
    if (storedRoster) {
        myTeamRoster = storedRoster;
        displayMyTeam();
    }
    
    document.querySelector('[data-pos="ALL"]').classList.add('active');
});

clearDataBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all draft data? This cannot be undone.")) {
        localStorage.removeItem(localStorageKey);
        localStorage.removeItem(localStorageRosterKey);
        allPlayers.forEach(p => p.draftedBy = 'None');
        myTeamRoster = { 'QB': [], 'RB': [], 'WR': [], 'TE': [], 'FLEX': [], 'K': [], 'DST': [], 'BN': [] };
        displayPlayers(allPlayers);
        statusMessage.textContent = 'All draft data has been cleared.';
    }
});

mainFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            allPlayers = parseCSV(e.target.result);
            updateRookieStatus();
            saveToLocalStorage(allPlayers);
            displayPlayers(allPlayers);
            statusMessage.textContent = 'New data loaded and saved.';
        };
        reader.readAsText(file);
    }
});

rookieFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            rookieNames = parseRookieCSV(e.target.result);
            saveToLocalStorage(rookieNames, localStorageRookiesKey);
            updateRookieStatus();
            displayPlayers(allPlayers);
            statusMessage.textContent = `Rookie data loaded and saved. Found ${rookieNames.length} rookies.`;
        };
        reader.readAsText(file);
    }
});

draftInput.addEventListener('input', () => {
    const searchText = draftInput.value.toLowerCase();
    let playersToSearch = allPlayers;
    
    const activeFilter = document.querySelector('.filter-button.active');
    if (activeFilter.dataset.pos === 'ROOKIES') {
        playersToSearch = allPlayers.filter(p => p.isRookie);
    }

    if (searchText.length > 1) {
        const filteredPlayers = playersToSearch.filter(p =>
            p.draftedBy === 'None' && (
                p.player.toLowerCase().includes(searchText) ||
                p.player.toLowerCase().split(' ')[0].includes(searchText) ||
                p.player.toLowerCase().split(' ')[1]?.includes(searchText)
            )
        ).slice(0, 10);

        displayAutocompleteResults(filteredPlayers);
    } else {
        autocompleteResults.style.display = 'none';
    }
});

autocompleteResults.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        const playerName = event.target.textContent.replace(/ <span class=\"rookie-indicator\">R<\/span>$/, '').trim();
        draftInput.value = playerName;
        autocompleteResults.style.display = 'none';
        draftButton.focus();
    }
});

draftButton.addEventListener('click', () => {
    const playerName = draftInput.value.trim();
    if (playerName) {
        const player = allPlayers.find(p => p.player.toLowerCase() === playerName.toLowerCase());
        if (player && player.draftedBy === 'None') {
            modalPlayerName.textContent = player.player;
            modalPlayerName.dataset.player = player.player;
            modalOverlay.style.display = 'flex';
        } else if (player) {
            statusMessage.textContent = `${player.player} has already been drafted.`;
        } else {
            statusMessage.textContent = `Player "${playerName}" not found.`;
        }
        draftInput.value = '';
        autocompleteResults.style.display = 'none';
    }
});

modalOverlay.addEventListener('click', (event) => {
    if (event.target.id === 'draft-modal-overlay') {
        modalOverlay.style.display = 'none';
    }
});

draftMyTeamBtn.addEventListener('click', () => {
    const playerName = modalPlayerName.dataset.player;
    toggleDraftedStatus(playerName, 'My Team');
    modalOverlay.style.display = 'none';
});

draftOtherTeamBtn.addEventListener('click', () => {
    const playerName = modalPlayerName.dataset.player;
    toggleDraftedStatus(playerName, 'Other Team');
    modalOverlay.style.display = 'none';
});

playerTableBody.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('draft-btn')) {
        const playerName = target.dataset.player;
        modalPlayerName.textContent = playerName;
        modalPlayerName.dataset.player = playerName;
        modalOverlay.style.display = 'flex';
    } else if (target.classList.contains('undraft-btn')) {
        const playerName = target.dataset.player;
        toggleDraftedStatus(playerName, 'None');
    }
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const position = button.dataset.pos;
        handleFilterClick(position);
    });
});

function handleFilterClick(position) {
    playerTable.style.display = 'none';
    depthChartDiv.style.display = 'none';
    teamRosterView.style.display = 'block';

    if (position === 'ALL') {
        displayPlayers(allPlayers);
    } else if (position === 'ROOKIES') {
        const playersToDisplay = allPlayers.filter(p => p.isRookie);
        if (playersToDisplay.length === 0 && rookieNames.length === 0) {
            statusMessage.textContent = 'No rookie data loaded. Please select a Rookie CSV.';
        }
        displayPlayers(playersToDisplay);
    } else if (position === 'DEPTH') {
        displayDepthChart();
    } else if (position === 'FLEX') {
        const playersToDisplay = allPlayers.filter(p => p.pos.startsWith('RB') || p.pos.startsWith('WR') || p.pos.startsWith('TE'));
        displayPlayers(playersToDisplay);
    } else {
        const playersToDisplay = allPlayers.filter(p => p.pos.startsWith(position));
        displayPlayers(playersToDisplay);
    }
}

// --- Data Management Functions ---
function updateRookieStatus() {
    if (rookieNames.length === 0) {
        allPlayers.forEach(p => p.isRookie = false);
        return;
    }
    const rookieNamesSet = new Set(rookieNames);
    allPlayers.forEach(p => {
        p.isRookie = rookieNamesSet.has(p.player);
    });
}

function parseRookieCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    const playerHeader = headers.find(h => h.includes('player'));
    if (!playerHeader) return [];
    
    const names = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const playerIndex = headers.indexOf(playerHeader);
        if (values[playerIndex]) {
            names.push(values[playerIndex].trim().replace(/^"|"$/g, ''));
        }
    }
    return names;
}

function addPlayerToMyTeam(player) {
    // Standardize position for checking roster spots
    const primaryPos = player.pos.startsWith('DST') || player.pos.startsWith('K')
        ? player.pos.split(' ')[0]
        : player.pos.substring(0, 2);

    let added = false;
    
    // 1. Try to add to the primary position first
    if (primaryPos in myTeamRoster && myTeamRoster[primaryPos].length < rosterSpots[primaryPos]) {
        myTeamRoster[primaryPos].push(player);
        added = true;
    } 
    
    // 2. If not added, try to add to a FLEX spot (if eligible)
    if (!added && (primaryPos === 'RB' || primaryPos === 'WR' || primaryPos === 'TE') && myTeamRoster['FLEX'].length < rosterSpots['FLEX']) {
        myTeamRoster['FLEX'].push(player);
        added = true;
    }
    
    // 3. If still not added, place on the bench
    if (!added) {
        if (myTeamRoster['BN'].length < rosterSpots['BN']) {
            myTeamRoster['BN'].push(player);
        } else {
            console.warn("Bench is full. Could not add player:", player.player);
        }
    }
    
    // Re-sort the roster to fill any empty primary or flex slots if a bench player is eligible
    // This is an advanced step, for now we will just log the state
    console.log("Player added. Current Roster State:", myTeamRoster);
    
    saveToLocalStorage(myTeamRoster, localStorageRosterKey);
    displayMyTeam();
}

function removePlayerFromMyTeam(player) {
    for (const pos in myTeamRoster) {
        const index = myTeamRoster[pos].findIndex(p => p.player === player.player);
        if (index !== -1) {
            myTeamRoster[pos].splice(index, 1);
            break;
        }
    }
    saveToLocalStorage(myTeamRoster, localStorageRosterKey);
    displayMyTeam();
}

function toggleDraftedStatus(name, team) {
    const player = allPlayers.find(p => p.player.toLowerCase() === name.toLowerCase());

    if (player) {
        if (team === 'None') {
            player.draftedBy = 'None';
            removePlayerFromMyTeam(player);
            statusMessage.textContent = `${player.player} has been undrafted.`;
        } else {
            if (player.draftedBy === 'None') { // Only add if not already drafted
                player.draftedBy = team;
                if (team === 'My Team') {
                    addPlayerToMyTeam(player);
                }
                statusMessage.textContent = `${player.player} has been drafted by ${team}.`;
            } else {
                statusMessage.textContent = `${player.player} is already drafted.`;
            }
        }
        saveToLocalStorage(allPlayers);
        
        const activeFilter = document.querySelector('.filter-button.active');
        if (activeFilter) {
            handleFilterClick(activeFilter.dataset.pos);
        }
    } else {
        statusMessage.textContent = `Player "${name}" not found.`;
    }
}

function loadFromLocalStorage(key = localStorageKey) {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (key === localStorageKey) {
                parsedData.forEach(player => {
                    if (!player.draftedBy) {
                        player.draftedBy = 'None';
                    }
                });
            }
            return parsedData;
        }
    } catch (e) {
        console.error("Failed to load or parse data from local storage:", e);
        localStorage.removeItem(key);
    }
    return null;
}

function saveToLocalStorage(data, key = localStorageKey) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save data to local storage:", e);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0].split(',').map(header => {
        return header.trim()
                     .toLowerCase()
                     .replace('player name', 'player')
                     .replace('ecr vs. adp', 'ecrvsadp')
                     .replace('bye week', 'byeweek')
                     .replace('sos season', 'sosseason')
                     .replace('avg. diff', 'avgdiff')
                     .replace(/[^a-zA-Z0-9]/g, '');
    });
    
    const players = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            let player = { draftedBy: 'None' };
            values.forEach((value, index) => {
                const headerKey = headers[index];
                player[headerKey] = value.trim().replace(/^"|"$/g, '');
            });
            players.push(player);
        }
    }
    return players;
}

// --- Display Functions ---
function displayPlayers(players) {
    playerTable.style.display = 'table';
    depthChartDiv.style.display = 'none';
    playerTableBody.innerHTML = '';
    teamRosterView.style.display = 'block';

    if (players.length === 0) {
        playerTableBody.innerHTML = '<tr><td colspan="11">No player data found.</td></tr>';
        return;
    }

    players.forEach(player => {
        const row = document.createElement('tr');
        if (player.draftedBy === 'My Team') {
            row.classList.add('drafted-me');
        } else if (player.draftedBy !== 'None') {
            row.classList.add('drafted-other');
        }
        const actionButtonHtml = player.draftedBy === 'None'
            ? `<button class="draft-btn" data-player="${player.player}">Draft</button>`
            : `<button class="undraft-btn" data-player="${player.player}">Undraft</button>`;
            
        const rookieIndicator = player.isRookie ? '<span class="rookie-indicator">R</span>' : '';
            
        row.innerHTML = `
            <td>${player.rk}</td>
            <td>${player.tiers}</td>
            <td>${player.player} ${rookieIndicator}</td>
            <td>${player.team}</td>
            <td>${player.pos}</td>
            <td>${player.byeweek}</td>
            <td>${player.sosseason}</td>
            <td>${player.ecrvsadp}</td>
            <td>${player.avgdiff}</td>
            <td>${player.over}</td>
            <td>${actionButtonHtml}</td>
        `;
        playerTableBody.appendChild(row);
    });
    displayMyTeam();
}

function displayAutocompleteResults(players) {
    autocompleteResults.innerHTML = '';
    if (players.length > 0) {
        players.forEach(player => {
            const div = document.createElement('div');
            const rookieIndicator = player.isRookie ? '<span class="rookie-indicator">R</span>' : '';
            div.innerHTML = `${player.player} ${rookieIndicator}`;
            autocompleteResults.appendChild(div);
        });
        autocompleteResults.style.display = 'block';
    } else {
        autocompleteResults.style.display = 'none';
    }
}

function displayDepthChart() {
    playerTable.style.display = 'none';
    depthChartDiv.style.display = 'block';
    depthChartDiv.innerHTML = '';
    teamRosterView.style.display = 'none';
    
    const teams = Object.keys(depthChartData);
    const positions = ['Running Backs', 'Wide Receivers', 'Tight Ends'];
    
    let htmlContent = '';
    
    teams.forEach(team => {
        htmlContent += `<div class="team-container">`;
        htmlContent += `<div class="team-header">${team}</div>`;
        htmlContent += `<table class="depth-chart-table">`;
        
        htmlContent += `<thead><tr><th></th>`;
        positions.forEach(pos => {
            htmlContent += `<th>${pos.split(' ')[0]}</th>`;
        });
        htmlContent += `</tr></thead>`;
        
        htmlContent += `<tbody>`;
        
        htmlContent += `<tr class="starter-row"><td>Starter</td>`;
        positions.forEach(pos => {
            const entry = depthChartData[team].find(e => e.position === pos);
            const starterName = entry ? entry.starter : 'N/A';
            const player = allPlayers.find(p => p.player === starterName);
            const draftedClass = player && player.draftedBy !== 'None' ? 'drafted-depth-chart' : '';
            htmlContent += `<td class="${draftedClass}">${starterName}</td>`;
        });
        htmlContent += `</tr>`;
        
        htmlContent += `<tr class="handcuff-row"><td>Handcuff</td>`;
        positions.forEach(pos => {
            const entry = depthChartData[team].find(e => e.position === pos);
            const handcuffName = entry ? entry.handcuff : 'N/A';
            const player = allPlayers.find(p => p.player === handcuffName);
            const draftedClass = player && player.draftedBy !== 'None' ? 'drafted-depth-chart' : '';
            htmlContent += `<td class="${draftedClass}">${handcuffName}</td>`;
        });
        htmlContent += `</tr>`;
        
        htmlContent += `</tbody></table></div>`;
    });
    
    depthChartDiv.innerHTML = htmlContent;
}

function displayMyTeam() {
    teamRosterView.innerHTML = '';
    teamRosterView.style.display = 'block';

    let htmlContent = '<h2>My Team</h2>';

    // Roster Spots - Starters
    htmlContent += '<h3>Starters</h3>';
    
    // We will use this to track which players have been displayed
    const playersToDisplay = { ...myTeamRoster };
    
    // Dynamically render Starters from the rosterSpots constant
    // This is more robust than a hard-coded list
    for (const pos in rosterSpots) {
        if (pos !== 'BN') { // BN is for bench
            for (let i = 0; i < rosterSpots[pos]; i++) {
                const player = playersToDisplay[pos][i];
                const playerName = player ? player.player : `Empty ${pos}`;
                const playerInfo = player ? `(${player.team}, ${player.pos})` : '';
                const draftedClass = player ? '' : 'roster-empty-slot';

                htmlContent += `
                    <div class="roster-position roster-starter">
                        <strong>${pos.toUpperCase()}:</strong>
                        <span class="player-name ${draftedClass}">${playerName}</span>
                        <span class="player-info">${playerInfo}</span>
                    </div>
                `;
            }
        }
    }

    // Bench
    htmlContent += '<h3 class="roster-bench-header">Bench</h3>';
    htmlContent += '<div class="roster-bench">';
    
    // Dynamically render Bench players
    if (myTeamRoster['BN'].length > 0) {
        myTeamRoster['BN'].forEach(player => {
            htmlContent += `
                <div class="roster-position">
                    <span class="player-name">${player.player}</span>
                    <span class="player-info">(${player.team}, ${player.pos})</span>
                </div>
            `;
        });
    }

    // Add empty bench slots to fill out the roster
    const benchSlotsToFill = rosterSpots['BN'] - myTeamRoster['BN'].length;
    for (let i = 0; i < benchSlotsToFill; i++) {
        htmlContent += `
            <div class="roster-position roster-empty-slot">
                <span class="player-name">Empty BN</span>
            </div>
        `;
    }
    htmlContent += '</div>';

    teamRosterView.innerHTML = htmlContent;
}