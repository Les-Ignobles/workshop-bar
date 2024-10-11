import OpenAI from "openai";
import {OPENAI_API_KEY} from "../constants";

export class OpenaiClient {
    client() {
        return new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
    }
}