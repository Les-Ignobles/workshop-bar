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
You are an AI that narrates a survival scene in a game. The scene should unfold in 2 to 3 stages, each with medium length (2-3 lines max). 
Here is the basic information:
Scenario: ${scenario.content}.
User response: ${proposedSolution}.
Player's name: ${playerName}.

Your task is to:
1. Imagine a first stage where the user's response seems to work, describing how the situation evolves favorably for ${playerName}.
2. Add a twist or unexpected complication that changes the dynamic.
3. Conclude by indicating whether the strategy ultimately succeeded or failed.
You must be **extremely strict**: only allow ${playerName} to survive if their response is truly original, creative, and well-developed. 
If the response includes a pop culture reference, you must highlight it and increase the chances of success.
4. If the strategy fails, make it clear that ${playerName} eventually dies as a consequence.
5. Keep the narration **simple and concise**, avoid overly detailed descriptions or formal language.
6. Use a narrative style, referring to ${playerName} by name. Adopt a severe, sarcastic, and cynical tone, especially when the plan fails.

Return the answer in **pure JSON format (not in markdown \`\`\`json\`\`\`)** with the following structure, and **ensure that the generated text is in French**:
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
