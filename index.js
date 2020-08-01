const teams = ['Rakib bhaiya', 'Soumik', 'Tahmid'];

const results = [];
// results['Rakib bhaiya vs Soumik'] = [4, 3];
// results['Tahmid vs Leon'] = [4, 4];
// results['Tahmid vs Soumik'] = [2, 0];
// results['Soumik vs Leon'] = [1, 4];
// results['Soumik vs Tahmid'] = [2, 1];

const getNewStandingsRow = name => ({
    name, played: 0, won: 0, drawn: 0, lost: 0, points: 0, gf: 0, ga: 0, gd: 0
});

const getStandingsFromResults =  results => {
    const standings = [];
    for (fixture in results) {
        const teams = fixture.split(' vs ');
        const goals = results[fixture].map(goal => Number(goal));
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

const getGoalInput = (placeholder, onchange) => {
    const goalInput = document.createElement('input');
    goalInput.type = 'number';
    goalInput.min = 0;
    goalInput.placeholder = placeholder;
    goalInput.onchange = e => onchange(e);
    return goalInput;
}

const getResultTd = (home, away, standingsTable) => {
    const fixtureKey = `${home} vs ${away}`;
    const fixturePlayed = results[fixtureKey] ? results[fixtureKey].length === 2 : false;
    const resultTd = document.createElement('td');
    const homeGoals = getGoalInput(home[0], e => {
        const goals = e.target.value;
        if (!results[fixtureKey]) results[fixtureKey] = [goals, null];
        else results[fixtureKey][0] = goals;
        populateStandingsTable(standingsTable);
    });
    const awayGoals = getGoalInput(away[0], e => {
        const goals = e.target.value;
        if (!results[fixtureKey]) results[fixtureKey] = [null, goals];
        else results[fixtureKey][1] = goals;
        populateStandingsTable(standingsTable);
    });
    const separator = document.createTextNode(' - ');
    if (fixturePlayed) {
        resultTd.classList.toggle('fixturePlayed');
        homeGoals.value = results[fixtureKey][0];
        awayGoals.value = results[fixtureKey][1];
    }
    resultTd.appendChild(homeGoals);
    resultTd.appendChild(separator)
    resultTd.appendChild(awayGoals);
    return resultTd;
}

const populateStandingsTable = standingsTable => {
    const trs = standingsTable.querySelectorAll('tr');
    trs.forEach(tr => {
        if (!tr.classList.contains('tableHeading')) {
            tr.remove();
        }
    });
    const standings = getStandingsFromResults(results);
    standings.forEach(standingsRow => {
        const standingsTr = document.createElement('tr');
        for (key in standingsRow) {
            standingsTr.appendChild(createTdFromData(standingsRow[key]));
        }
        standingsTable.appendChild(standingsTr);
    });
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
                const resultTd = getResultTd(home, away, standingsTable);
                if (resultTd.classList.contains('fixturePlayed')) {
                    fixturesTr.classList.add('fixturePlayed');
                }
                fixturesTr.appendChild(resultTd);
                fixturesTable.appendChild(fixturesTr);
            }
        });
    });
    
    populateStandingsTable(standingsTable);
};
