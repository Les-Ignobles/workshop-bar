import {onRequest} from "firebase-functions/v2/https";
import {OpenaiClient} from "../shared/client/openai-client";

export const analyzePhoto = onRequest(async (request, response) => {
    const iaClient = new OpenaiClient().client();

    const imgUrl = request.body.img_url;
    const position = request.body.position;

    if (!imgUrl) {
        response.status(403).json({error: "imgUrl ID is required"})
        return
    }

    if (!position) {
        response.status(403).json({error: "position is required"})
        return
    }

    const prompt = `
You are a fun AI who is gonna decide if somebody can drive or not after a bar.

Your role is to:
1. Check the photo of the person
2. Compare the photo with the fun position asked
3. Decide if the person can drive or not based on the photo
4. Answer with a fun explanation in France and decide in can drive or not

Here are the details of the user photo and the position asked:

- Position: ${position}
- Photo url: ${imgUrl}

Example : canDrive : false - "Vu la tête que tu tires, laisse les clés à tes potes et va dormir grand fou".

Return the outcome in **pure JSON format (not in markdown \`\`\`json\`\`\`)** with the following structure, and **ensure that the generated text is in French**:
{
  "canDrive": true or false
  "explanation": "The explanation of the result"
}
    `;

    console.log("Prompt: ", prompt)
    const iaResponse = await iaClient.chat.completions.create({
        messages: [{role: "user", content: prompt}],
        model: "gpt-3.5-turbo",
    })

    console.log(iaResponse.choices[0].message.content)

    response.json(JSON.parse(iaResponse.choices[0].message.content ?? "{}"))
});
