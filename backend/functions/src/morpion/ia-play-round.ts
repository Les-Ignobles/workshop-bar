import {onRequest} from "firebase-functions/v2/https";
import {OpenaiClient} from "../shared/client/openai-client";

export const iaPlayRound = onRequest(async (request, response) => {
    const iaClient = new OpenaiClient().client();
    const game = request.body.game;

    if (!game) {
        response.status(403).json({error: "Game is required"})
    }


    const prompt = `
You are the world champion of Tic-Tac-Toe, undefeated for 10 years.
You're playing against a human. Here is the current game grid:

${game}

0: empty cell
1: opponent's move
2: your move
Replace one 0 with a 2 to make your move. Return the updated grid in this JSON format:

{grid: [updated grid]}

Return the outcome in **pure JSON format (not in markdown \`\`\`json\`\`\`)** with the following structure which represent updated grid :
{
grid: Array<number>
}
    `;

    console.log(prompt)

    const iaResponse = await iaClient.chat.completions.create({
        messages: [{role: "user", content: prompt}],
        model: "gpt-3.5-turbo-0125",
    })

    const iaGrid = JSON.parse(iaResponse.choices[0].message.content ?? '[]');

    response.json(iaGrid)
});
