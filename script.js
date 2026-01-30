let currentPlayer = null;
let currentBasePrice = 0;
let highestBid = 0;
let leadingTeam = "";
let auctionData = [];
let teams = [];
let soldPlayers = [];


function startAuction() {
    currentPlayer = document.getElementById("playerName").value;
    currentBasePrice = parseInt(document.getElementById("basePrice").value);

    if (!currentPlayer || !currentBasePrice) {
        alert("Enter player name and base price");
        return;
    }

    highestBid = currentBasePrice;
    leadingTeam = "None";

    document.getElementById("currentPlayer").innerText = currentPlayer;
    document.getElementById("currentBase").innerText = currentBasePrice;
    document.getElementById("highestBid").innerText = highestBid;
    document.getElementById("leadingTeam").innerText = leadingTeam;
}

function placeBid() {
    const team = document.getElementById("teamSelect").value;
    const bid = parseInt(document.getElementById("bidAmount").value);

    if (!team || !bid) {
        alert("Enter team name and bid amount");
        return;
    }

    if (bid <= highestBid) {
        alert("Bid must be higher than current highest bid!");
        return;
    }

    highestBid = bid;
    leadingTeam = team;

    document.getElementById("highestBid").innerText = highestBid;
    document.getElementById("leadingTeam").innerText = leadingTeam;

    auctionData.push({ player: currentPlayer, team, bid });

    const row = `<tr>
        <td>${currentPlayer}</td>
        <td>${team}</td>
        <td>points${bid}</td>
    </tr>`;
    document.querySelector("#bidTable tbody").innerHTML += row;
}

function markSold() {
    if (!currentPlayer) return alert("No player in auction");

    alert(`${currentPlayer} SOLD to ${leadingTeam} for points${highestBid}`);
    currentPlayer = null;
}

function exportToCSV() {
    let csv = "Player,Team,Bid Amount\n";
    auctionData.forEach(row => {
        csv += `${row.player},${row.team},${row.bid}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "auction_results.csv";
    a.click();
}

function addTeam() {
    const teamName = document.getElementById("teamInput").value.trim();

    if (!teamName) {
        alert("Enter a team name");
        return;
    }

    if (teams.includes(teamName)) {
        alert("Team already added");
        return;
    }

    teams.push(teamName);

    // Add to visible list
    const li = document.createElement("li");
    li.innerText = teamName;
    document.getElementById("teamList").appendChild(li);

    // Add to dropdown
    const option = document.createElement("option");
    option.value = teamName;
    option.text = teamName;
    document.getElementById("teamSelect").appendChild(option);

    document.getElementById("teamInput").value = "";
}

function showSoldBanner(player, team, price) {
    const banner = document.getElementById("soldBanner");
    const details = document.getElementById("soldDetails");

    details.innerText = `${player} SOLD to ${team} for points${price}`;

    banner.classList.add("show");

    setTimeout(() => {
        banner.classList.remove("show");
    }, 3000);
}


function markSold() {
    if (!currentPlayer) {
        alert("No player in auction");
        return;
    }

    if (leadingTeam === "None") {
        alert("No bids placed yet!");
        return;
    }

    // Store sold data
    soldPlayers.push({
        player: currentPlayer,
        team: leadingTeam,
        price: highestBid
    });

    // Add to SOLD table
    const row = `<tr>
        <td>${currentPlayer}</td>
        <td>${leadingTeam}</td>
        <td>points${highestBid}</td>
    </tr>`;
    document.querySelector("#soldTable tbody").innerHTML += row;

    // 🎉 SHOW SOLD BANNER
    showSoldBanner(currentPlayer, leadingTeam, highestBid);

    // Reset current auction display
    currentPlayer = null;
    highestBid = 0;
    leadingTeam = "None";

    document.getElementById("currentPlayer").innerText = "None";
    document.getElementById("currentBase").innerText = "0";
    document.getElementById("highestBid").innerText = "0";
    document.getElementById("leadingTeam").innerText = "None";
}


function exportToCSV() {
    let csv = "";

    // ================= TEAMS =================
    csv += "=== REGISTERED TEAMS ===\n";
    csv += "Team Name\n";
    teams.forEach(team => {
        csv += `${team}\n`;
    });

    csv += "\n";

    // ================= SOLD PLAYERS =================
    csv += "=== SOLD PLAYERS ===\n";
    csv += "Player,Sold Team,Final Price\n";
    soldPlayers.forEach(p => {
        csv += `${p.player},${p.team},${p.price}\n`;
    });

    csv += "\n";

    // ================= BID HISTORY =================
    csv += "=== BID HISTORY ===\n";
    csv += "Player,Team,Bid Amount\n";
    auctionData.forEach(row => {
        csv += `${row.player},${row.team},${row.bid}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "auction_results.csv";
    a.click();
}
