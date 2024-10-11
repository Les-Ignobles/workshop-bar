import {onRequest} from "firebase-functions/v2/https";
import {Scenario} from "./core/types/scenario";
import {OpenaiClient} from "../shared/client/openai-client";
import {SupabaseClient} from "../shared/client/supabase-client";

export const analyzeSolution = onRequest(async (request, response) => {
    const iaClient = new OpenaiClient().client();
    const supabaseClient = new SupabaseClient().client();

    const scenarioId = request.body.scenario_id;
    const proposedSolution = request.body.solution;
    const playerName = request.body.player_name;

    if (!scenarioId) {
        response.status(403).json({error: "Scenario ID is required"})
        return
    }

    if (!proposedSolution) {
        response.status(403).json({error: "Solution is required"})
        return
    }

    if (!playerName) {
        response.status(403).json({error: "Player name is required"})
        return
    }

    const {data: scenario, error} = await supabaseClient
        .from('danger_scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single<Scenario>()

    if (error || !scenario) {
        response.status(403).json({error: "Scenario not found"})
        return
    }


    const prompt = `
You are an AI in a survival game where the player's objective is to survive dangerous situations based on their proposed solutions.

Your role is to:
1. Evaluate the user's solution to a given survival scenario by comparing it with predefined solution hints.
2. Provide feedback on whether the player's response is realistic and creative enough to result in a "success" or if it leads to "failure".
3. Narrate the survival outcome based on the result of your evaluation. 
If the player's response aligns well with the solution hints or shows creativity, the result should be "success". 
If not, the result is "failure", and the player ultimately dies or fails to escape the situation.

Here are the details of the current survival scenario and the player's response:

- Scenario: ${scenario.content}
- Player's response: ${proposedSolution}
- Player's name: ${playerName}
- Solution hints: ${scenario.solutions}

Your task in this section:
1. Carefully analyze the player's response (${proposedSolution}) and compare it with the solution hints (${scenario.solutions}).
2. Determine whether the player's response follows a realistic and creative approach in line with the solution hints.
3. If the response matches or is close to the hints, or if it's creative and feasible, mark it as a "success".
4. If the response is unrealistic, poorly thought out, or does not align with the hints, mark it as a "failure".

Based on your evaluation from the previous section, you will now write the outcome of the player's survival attempt.

Follow these instructions for writing the outcome:
1. If the result is "success":
   - Write a concise, 2-3 stage narrative where the player's actions lead to survival.
   - Highlight how their quick thinking or realistic approach saved them.
   - Keep the tone light but with a hint of sarcasm.

2. If the result is "failure":
   - Write a concise, 2-3 stage narrative where the player's actions fail to protect them.
   - Mention the fatal mistake or the factor that led to their demise.
   - Adopt a more cynical and sarcastic tone, making it clear that ${playerName} ultimately dies or fails to escape the situation.

Return the outcome in **pure JSON format (not in markdown \`\`\`json\`\`\`)** with the following structure, and **ensure that the generated text is in French**:
{
  "stages": [
    "First stage description (2-3 lines max, in French, simple and concise)",
    "Second stage description (2-3 lines max, in French, simple and concise)",
    "Third stage description (if needed, 2-3 lines max, in French, simple and concise)"
  ],
  "result": "success" or "failure"
}
    `;

    console.log("Prompt: ", prompt)
    const iaResponse = await iaClient.chat.completions.create({
        messages: [{role: "user", content: prompt}],
        model: "gpt-4o-mini",
    })

    console.log(iaResponse.choices[0].message.content)

    response.json(JSON.parse(iaResponse.choices[0].message.content ?? "{}"))
});
