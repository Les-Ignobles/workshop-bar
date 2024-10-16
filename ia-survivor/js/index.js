import { constants } from "./constants.js";

let selectedScenario = null;
let solutionResponse = ''
let isLoading = false;

document.addEventListener('DOMContentLoaded', async function() {
    const scenarios = await fetchScenarios();
    displayScenarioRandomly(scenarios);
    onClickChangeScenarioBtn(scenarios);
    onClickSubmitSolutionBtn();
});



async function fetchScenarios() {
  const url = `${constants.API_URL}/danger_scenarios`;
  const scenarios = await fetch(url, {
    headers: {
      apikey: constants.API_KEY,
    },
  });
  return await scenarios.json();
}

async function proposeSolutionToScenario(playerName, solution, scenarioId) {
    const url = `http://127.0.0.1:5001/workshop-b1-2024/us-central1/analyzeSolution`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player_name: playerName,
            solution: solution,
            scenario_id: scenarioId,
        }),
    });

    const iaResponse = await response.json();
    console.log(iaResponse);
}

function displayScenarioRandomly(scenarios) {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    selectedScenario = randomScenario;
    const selectedScenarioElement = document.querySelector('p#selected-scenario');
    selectedScenarioElement.textContent = randomScenario.content;
}

function onClickChangeScenarioBtn(scenarios) {
    const changeScenarioBtn = document.querySelector('img#pick-random-scenario');
    changeScenarioBtn.addEventListener('click', async () => {
        displayScenarioRandomly(scenarios);
    });
}

async function onClickSubmitSolutionBtn() {
    const submitSolutionBtn = document.querySelector('button#solution-btn-submit');
    submitSolutionBtn.addEventListener('click', async () => {
        const solutionInput = document.querySelector('textarea#solution-area');
        const playerNameInput = document.querySelector('input#input-name');
        const solution = solutionInput.value;
        const scenarioId = selectedScenario.id;
        const playerName = playerNameInput.value;
        isLoading = true;
        const response = await proposeSolutionToScenario(playerName, solution, scenarioId);
        isLoading = false;
    });
}
