const teams = ["Rakib bhaiya", "Soumik", "Tahmid", "Leon"];

const results = [];
results['Rakib bhaiya vs Soumik'] = '4 - 3';
results['Tahmid vs Leon'] = '4 - 4';
results['Tahmid vs Soumik'] = '2 - 0';
results['Soumik vs Leon'] = '1 - 4';
results['Soumik vs Tahmid'] = '2 - 1';

const getNewStandingsRow = name => ({
    name, played: 0, won: 0, lost: 0, drawn: 0, points: 0, gf: 0, ga: 0, gd: 0
});

const getStandingsFromResults =  results => {
    const standings = [];
    for (fixture in results) {
        const teams = fixture.split(' vs ');
        const goals = results[fixture].split(' - ').map(goal => Number(goal));
        for (let i = 0; i < teams.length; i++) {
            const team = teams[i];
            let entryForTeam = standings.find(entry => entry.name === team);
            if (!entryForTeam) {
                entryForTeam = getNewStandingsRow(team);
                standings.push(entryForTeam);
            }
            const goalsFor = goals[i];
            const goalsAgainst = goals[(i + 1) % 2];
            entryForTeam.played++;
            entryForTeam.gf += goalsFor;
            entryForTeam.ga += goalsAgainst;
            entryForTeam.gd += (goalsFor - goalsAgainst);
            if (goalsFor > goalsAgainst) {
                entryForTeam.won++;
                entryForTeam.points += 3;
            } else if (goalsFor === goalsAgainst) {
                entryForTeam.drawn++;
                entryForTeam.points++;
            } else {
                entryForTeam.lost++;
            }
        }
    }
    return standings.sort((team1, team2) => {
        if (team1.points === team2.points) {
            return team2.gd - team1.gd;
        }
        return team2.points - team1.points;
    });
};

const createTdFromData = data => {
    const td = document.createElement('td');
    td.innerText = data;
    return td;
}

window.onload = () => {
    const fixturesTable = document.querySelector('#fixtures');
    const standingsTable = document.querySelector('#standings');

    // populate fixtures table
    let gameNo = 0;
    teams.map(home => {        
        teams.map(away => {
            if (home !== away) {
                const fixturesTr = document.createElement('tr');
                fixturesTr.appendChild(createTdFromData(++gameNo));
                fixturesTr.appendChild(createTdFromData(home));
                fixturesTr.appendChild(createTdFromData(away));
                fixturesTr.appendChild(createTdFromData(results[`${home} vs ${away}`]));
                fixturesTable.appendChild(fixturesTr);
            }
        });
    });
    
    // populate standings table
    const standings = getStandingsFromResults(results);
    standings.forEach(standingsRow => {
        const standingsTr = document.createElement('tr');
        for (key in standingsRow) {
            standingsTr.appendChild(createTdFromData(standingsRow[key]));
        }
        standingsTable.appendChild(standingsTr);
    });
};
