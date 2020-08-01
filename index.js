const teams = ["Rakib bhaiya", "Soumik", "Tahmid", "Leon"];

const createTdFromData = data => {
    const td = document.createElement('td');
    td.innerText = data;
    return td;
}

const results = [];
results['Rakib bhaiya vs Soumik'] = '4 - 3';
results['Tahmid vs Leon'] = '4 - 4';

window.onload = () => {
    const fixtures = document.querySelector('#fixtures');
    const standings = document.querySelector('#standings');
    let gameNo = 0;
    teams.map(home => {
        const standingsTr = document.createElement('tr');
        standingsTr.appendChild(createTdFromData(home));
        let won = 0;
        let drawn = 0;
        let lost = 0;
        let gf = 0;
        let ga = 0;
        let gd = 0;
        for (key in results) {
            const teams = key.split(' vs ');
            const goals = results[key].split(' - ').map(goal => Number(goal));
            const homeIndex = teams.indexOf(home);
            if (homeIndex !== -1) {
                const otherIndex = (homeIndex + 1) % 2;
                const homeGoals = goals[homeIndex];
                const otherGoals = goals[otherIndex];
                if (homeGoals > otherGoals) won++;
                else if (homeGoals === otherGoals) drawn++;
                else lost++;
                gf += homeGoals;
                ga += otherGoals;
                gd = gf - ga;    
            }
        }
        standingsTr.appendChild(createTdFromData(won));
        standingsTr.appendChild(createTdFromData(drawn));
        standingsTr.appendChild(createTdFromData(lost));
        standingsTr.appendChild(createTdFromData((won * 3) + drawn));
        standingsTr.appendChild(createTdFromData(gf));
        standingsTr.appendChild(createTdFromData(ga));
        standingsTr.appendChild(createTdFromData(gd));
        standings.appendChild(standingsTr);
        teams.map(away => {
            if (home !== away) {
                const fixturesTr = document.createElement('tr');
                fixturesTr.appendChild(createTdFromData(++gameNo));
                fixturesTr.appendChild(createTdFromData(home));
                fixturesTr.appendChild(createTdFromData(away));
                fixturesTr.appendChild(createTdFromData(results[`${home} vs ${away}`]));
                fixtures.appendChild(fixturesTr);
            }
        });
    });    
};
