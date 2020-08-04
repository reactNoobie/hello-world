const getNewStandingsRow = name => ({
    name, played: 0, won: 0, drawn: 0, lost: 0, points: 0, gf: 0, ga: 0, gd: 0
});

const getNewFixturesRow = (gameNo, home, away) => ({
    gameNo, home, away, homeGoals: null, awayGoals: null, fixturePlayed: false
});

const getStandingsFromFixtures = fixtures => {
    const standings = [
        // { name: 'Soumik', played: 1, won: 1, drawn: 0, lost: 0, points: 3, gf: 1, ga: 0, gd: 1},
        // { name: 'Tahmid', played: 1, won: 1, drawn: 0, lost: 0, points: 3, gf: 1, ga: 0, gd: 1},
    ];
    fixtures.forEach(({ home, away, homeGoals, awayGoals, fixturePlayed }) => {
        if (fixturePlayed) {
            let entryForHome = standings.find(entry => entry.name === home);
            if (!entryForHome) {
                entryForHome = getNewStandingsRow(home);
                standings.push(entryForHome);
            }
            entryForHome.gf += homeGoals;
            entryForHome.ga += awayGoals;
            entryForHome.gd += (homeGoals - awayGoals);

            let entryForAway = standings.find(entry => entry.name === away);
            if (!entryForAway) {
                entryForAway = getNewStandingsRow(away);
                standings.push(entryForAway);
            }
            entryForAway.gf += awayGoals;
            entryForAway.ga += homeGoals;
            entryForAway.gd += (awayGoals - homeGoals);

            entryForHome.played++;
            entryForAway.played++;
            if (homeGoals > awayGoals) {
                entryForHome.won++;
                entryForHome.points += 3;
                entryForAway.lost++;
            } else if (awayGoals > homeGoals) {
                entryForAway.won++;
                entryForAway.points += 3;
                entryForHome.lost++;
            } else {
                entryForHome.drawn++;
                entryForHome.points++;
                entryForAway.drawn++;
                entryForAway.points++;
            }
        }
    });

    return standings.sort((team1, team2) => {
        if (team1.points === team2.points) {
            return team2.gd - team1.gd;
        }
        return team2.points - team1.points;
    });
};

const getFixturesFromTeams = teams => {
    const fixtures = [
        // { gameNo: 1, home: 'Soumik', away: 'Leon', homeGoals: 1, awayGoals: 0, fixturePlayed: false }
    ];
    let gameNo = 0;
    teams.forEach(home => {
        teams.forEach(away => {
            if (home !== away) {
                fixtures.push(getNewFixturesRow(++gameNo, home, away));
            }
        });
    });
    return fixtures;
};

const getTdFromData = data => {
    const td = document.createElement('td');
    td.innerText = data;
    return td;
}

const getGoalInput = (goalFor, placeholder, value, onchange) => {
    const goalInput = document.createElement('input');
    goalInput.classList.add('goalInput');
    goalInput.setAttribute('data-goal-for', goalFor);
    goalInput.type = 'number';
    goalInput.min = 0;
    goalInput.placeholder = placeholder;
    goalInput.value = value;
    goalInput.onchange = e => onchange(e);
    return goalInput;
}

const isFixturePlayed = fixture => (fixture.homeGoals !== null && fixture.awayGoals !== null);

const getResultTd = (fixture, fixtures) => {
    const resultTd = document.createElement('td');
    const onGoalChanged = e => {
        const goalInput = e.target;
        const keyToUpdate = goalInput.getAttribute('data-goal-for') === 'home' ?
            'homeGoals' : 'awayGoals';
        const updatedFixture = Object.assign({}, fixture);
        updatedFixture[keyToUpdate] = Number(goalInput.value);
        updatedFixture.fixturePlayed = isFixturePlayed(updatedFixture)
        const updatedFixtures = fixtures.map(f => (
            f.gameNo === updatedFixture.gameNo ? updatedFixture : f
        ));
        localStorage.setItem('fixtures', JSON.stringify(updatedFixtures));
        render();
    };
    const homeGoals = getGoalInput('home', fixture.home[0], fixture.homeGoals, onGoalChanged);
    const awayGoals = getGoalInput('away', fixture.away[0], fixture.awayGoals, onGoalChanged);
    const separator = document.createTextNode(' - ');
    resultTd.appendChild(homeGoals);
    resultTd.appendChild(separator)
    resultTd.appendChild(awayGoals);
    return resultTd;
}

const clearTableData = table => {
    const trs = table.querySelectorAll('tr');
    trs.forEach(tr => {
        if (!tr.classList.contains('tableHeading')) {
            tr.remove();
        }
    });
}

const populateTeamsTable = teamsTable => {
    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    clearTableData(teamsTable);
    teams.forEach(team => {
        const teamTr = document.createElement('tr');
        teamTr.appendChild(getTdFromData(team));
        teamsTable.appendChild(teamTr);
    });
};

const populateFixturesTable = fixturesTable => {
    const fixtures = JSON.parse(localStorage.getItem('fixtures')) || [];
    clearTableData(fixturesTable);
    fixtures.forEach(fixture => {
        const fixtureTr = document.createElement('tr');
        if (fixture.fixturePlayed) {
            fixtureTr.classList.add('fixturePlayed');
        }
        fixtureTr.appendChild(getTdFromData(fixture.gameNo));
        fixtureTr.appendChild(getTdFromData(fixture.home));
        fixtureTr.appendChild(getTdFromData(fixture.away));
        const resultTd = getResultTd(fixture, fixtures);
        fixtureTr.appendChild(resultTd);
        fixturesTable.appendChild(fixtureTr);
    });
};

const populateStandingsTable = standingsTable => {
    const fixtures = JSON.parse(localStorage.getItem('fixtures')) || [];
    const standings = getStandingsFromFixtures(fixtures);
    clearTableData(standingsTable);
    standings.forEach(standingsRow => {
        const standingsTr = document.createElement('tr');
        for (key in standingsRow) {
            standingsTr.appendChild(getTdFromData(standingsRow[key]));
        }
        standingsTable.appendChild(standingsTr);
    });
}

const render = () => {
    populateTeamsTable(document.querySelector('#teams'));
    populateFixturesTable(document.querySelector('#fixtures'));
    populateStandingsTable(document.querySelector('#standings'));
}

window.onload = () => {
    render();
    const resetButton = document.querySelector('#resetButton');
    resetButton.onclick = () => {
        localStorage.clear();
        render();
    }
    const playerNameInput = document.querySelector('#playerNameInput');
    const addPlayerButton = document.querySelector('#addPlayerButton');
    addPlayerButton.disabled = true;
    playerNameInput.onkeyup = e => {
        addPlayerButton.disabled = !e.target.value.trim();
    }
    addPlayerButton.onclick = () => {
        const teams = JSON.parse(localStorage.getItem('teams')) || [];
        const processedValue = playerNameInput.value.trim();
        if (!teams.includes(processedValue)) {
            playerNameInput.value = '';
            const newTeams = [...teams, processedValue];
            const newFixtures = getFixturesFromTeams(newTeams);
            localStorage.clear();
            localStorage.setItem('teams', JSON.stringify(newTeams));
            localStorage.setItem('fixtures', JSON.stringify(newFixtures));
            render();
        } else {
            alert(`${processedValue} is already in!`);
        }
    }
};
