import { constants } from "./constants.js";

const scenarios = await fetchScenarios();
console.log(scenarios);



/**
 *
 * @returns {Promise<object[]>}
 */
async function fetchScenarios() {
  const url = `${constants.API_URL}/danger_scenarios`;
  const scenarios = await fetch(url, {
    headers: {
      apikey: constants.API_KEY,
    },
  });
  return await scenarios.json();
}

/**
 * @param {string} proposition
 * @param {number} scenarioId
 */
async function proposeSolutionToScenario(proposition, scenarioId) {}
